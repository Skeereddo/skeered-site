import bcrypt from 'bcryptjs';
import * as jwt from '@tsndr/cloudflare-worker-jwt';

// JWT secret will be stored as a Worker secret
// wrangler secret put JWT_SECRET
// (use a strong random string)

async function hashPassword(password) {
	return await bcrypt.hash(password, 10);
}

async function verifyPassword(password, hash) {
	return await bcrypt.compare(password, hash);
}

async function generateToken(user, env) {
	return await jwt.sign(
		{
			sub: user.id,
			email: user.email,
			exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 days
		},
		env.JWT_SECRET
	);
}

async function verifyToken(token, env) {
	try {
		const isValid = await jwt.verify(token, env.JWT_SECRET);
		if (!isValid) {
			console.log('Token verification failed');
			return null;
		}
		
		const decoded = jwt.decode(token);
		console.log('Token decoded:', decoded); // Debug log

		// The sub exists in the payload, so we should return the decoded token
		if (decoded && decoded.payload) {
			return decoded.payload; // Return the payload which contains sub, email, etc.
		}

		console.log('Token decoded but invalid structure:', decoded);
		return null;
	} catch (error) {
		console.error('Token verification error:', error);
		return null;
	}
}

async function handleRegister(request, env, corsHeaders) {
	try {
		const { email, password } = await request.json();

		// Validate input
		if (!email || !password) {
			return new Response('Missing email or password', { 
				status: 400,
				headers: corsHeaders
			});
		}

		console.log('Attempting to check existing user'); // Debug log
		// Check if user exists
		const existingUser = await env.DB.prepare(
			'SELECT id FROM users WHERE email = ?'
		)
		.bind(email)
		.first();

		if (existingUser) {
			return new Response('User already exists', { 
				status: 400,
				headers: corsHeaders
			});
		}

		console.log('Hashing password'); // Debug log
		// Hash password and create user
		const passwordHash = await bcrypt.hash(password, 10);

		console.log('Inserting new user'); // Debug log
		const result = await env.DB.prepare(
			'INSERT INTO users (email, password_hash) VALUES (?, ?)'
		)
		.bind(email, passwordHash)
		.run();

		return new Response(JSON.stringify({ 
			message: 'User created successfully' 
		}), {
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders
			}
		});
	} catch (error) {
		// Detailed error logging
		console.error('Registration error:', error);
		return new Response(JSON.stringify({ 
			error: 'Registration failed',
			details: error.message,
			stack: error.stack
		}), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders
			}
		});
	}
}

async function handleLogin(request, env, corsHeaders) {
	try {
		const { email, password } = await request.json();

		// Get user
		const user = await env.DB.prepare(
			'SELECT * FROM users WHERE email = ?'
		)
		.bind(email)
		.first();

		if (!user) {
			return new Response(JSON.stringify({ error: 'Invalid credentials' }), { 
				status: 401,
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders
				}
			});
		}

		// Verify password
		const valid = await bcrypt.compare(password, user.password_hash);
		if (!valid) {
			return new Response(JSON.stringify({ error: 'Invalid credentials' }), { 
				status: 401,
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders
				}
			});
		}

		// Generate token with consistent user ID format
		const token = await jwt.sign(
			{
				sub: user.id, // This will be a number from the database
				email: user.email,
				exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 days
			},
			env.JWT_SECRET
		);

		console.log('Generated token for user:', user.id);

		return new Response(JSON.stringify({ 
			token,
			email: user.email,
			userId: user.id
		}), {
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders
			}
		});
	} catch (error) {
		console.error('Login error:', error);
		return new Response(JSON.stringify({ 
			error: 'Login failed',
			details: error.message
		}), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders
			}
		});
	}
}

async function handleGetUserPurchases(request, env, corsHeaders) {
	try {
		const user = await authenticateRequest(request, env);
		if (!user || user.sub === undefined) {
			console.log('User not authenticated or missing ID:', user);
			return new Response(JSON.stringify({ error: 'Unauthorized' }), {
				status: 401,
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders
				}
			});
		}

		console.log('Fetching purchases for user:', user.sub);

		try {
			// Convert user.sub to string if it's a number
			const userId = String(user.sub);
			console.log('Using user ID for query:', userId);

			const result = await env.DB.prepare(`
				SELECT id, order_id, product_id, purchase_date, last_download
				FROM purchases 
				WHERE user_id = ?
			`).bind(userId).all();

			console.log('Purchases query result:', result);

			return new Response(JSON.stringify(result.results || []), {
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders
				}
			});
		} catch (queryError) {
			console.error('Database query error:', queryError);
			console.error('SQL Error:', queryError.message);
			throw queryError;
		}
	} catch (error) {
		console.error('Error in handleGetUserPurchases:', error);
		return new Response(JSON.stringify({ 
			error: 'Failed to fetch purchases',
			details: error.message 
		}), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders
			}
		});
	}
}

// Middleware to verify authentication
async function authenticateRequest(request, env) {
	try {
		// Try to get token from Authorization header first
		const authHeader = request.headers.get('Authorization');
		let token = authHeader && authHeader.startsWith('Bearer ') 
			? authHeader.slice(7) 
			: null;

		// If no Authorization header, try cookie
		if (!token) {
			token = request.headers.get('Cookie')?.match(/token=([^;]+)/)?.[1];
		}

		if (!token) {
			console.log('No token found in request');
			return null;
		}

		console.log('Token found:', token.substring(0, 20) + '...');
		const decoded = await verifyToken(token, env);
		
		if (!decoded || decoded.sub === undefined) {
			console.log('Invalid token or missing user ID:', decoded);
			return null;
		}

		console.log('Token verified for user:', decoded.sub);
		return decoded;
	} catch (error) {
		console.error('Authentication error:', error);
		return null;
	}
}

// Instead, create a function to get the API base
function getPayPalCredentials(env) {
	const useSandbox = env.USE_SANDBOX === 'true';
	return {
		clientId: useSandbox ? env.PAYPAL_CLIENT_ID_SANDBOX : env.PAYPAL_CLIENT_ID,
		clientSecret: useSandbox ? env.PAYPAL_CLIENT_SECRET_SANDBOX : env.PAYPAL_CLIENT_SECRET,
		apiBase: useSandbox 
			? 'https://api-m.sandbox.paypal.com'
			: 'https://api-m.paypal.com'
	};
}

async function getPayPalAccessToken(env) {
	const { clientId, clientSecret, apiBase } = getPayPalCredentials(env);
	const auth = btoa(`${clientId}:${clientSecret}`);
	
	const response = await fetch(`${apiBase}/v1/oauth2/token`, {
		method: 'POST',
		body: 'grant_type=client_credentials',
		headers: {
			'Authorization': `Basic ${auth}`,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	});

	const data = await response.json();
	return data.access_token;
}

async function handleCreateOrder(request, env, corsHeaders) {
	try {
		const { items } = await request.json();
		const accessToken = await getPayPalAccessToken(env);

		// Calculate total from items
		const total = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)) / 100, 0);

		const order = {
			intent: 'CAPTURE',
			purchase_units: [{
				amount: {
					currency_code: 'USD',
					value: total.toFixed(2),
				},
				description: "Shop & Gifting System",
			}],
			application_context: {
				brand_name: 'Skeered',
				landing_page: 'NO_PREFERENCE',
				user_action: 'PAY_NOW',
				return_url: `${env.CLIENT_URL}/success`,
				cancel_url: `${env.CLIENT_URL}/cancel`,
			},
		};

		const response = await fetch(`${getPayPalCredentials(env).apiBase}/v2/checkout/orders`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(order),
		});

		const data = await response.json();
		
		return new Response(JSON.stringify(data), {
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders
			},
			status: response.ok ? 200 : 400,
		});
	} catch (error) {
		console.error('Create order error:', error);
		return new Response(JSON.stringify({ 
			error: 'Failed to create order',
			details: error.message 
		}), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders
			}
		});
	}
}

async function handleCapturePayment(request, env, corsHeaders) {
	try {
		const user = await authenticateRequest(request, env);
		if (!user || user.sub === undefined) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), {
				status: 401,
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders
				}
			});
		}

		const { orderID } = await request.json();
		console.log('Processing payment for user:', user.sub, 'order:', orderID);

		const accessToken = await getPayPalAccessToken(env);

		// Capture the payment
		const response = await fetch(`${getPayPalCredentials(env).apiBase}/v2/checkout/orders/${orderID}/capture`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			}
		});

		const data = await response.json();
		console.log('PayPal capture response:', data);

		if (!response.ok) {
			console.error('PayPal capture error:', data);
			return new Response(JSON.stringify({
				error: 'Payment capture failed',
				details: data
			}), {
				status: response.status,
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders
				}
			});
		}

		// If payment is successful, store the purchase
		if (data.status === 'COMPLETED') {
			try {
				// Insert the purchase record
				const result = await env.DB.prepare(`
					INSERT INTO purchases (user_id, order_id, product_id)
					VALUES (?, ?, ?)
				`).bind(
					String(user.sub), // Convert to string for consistency
					orderID,
					'shop_gifting_system' // Default product ID if not specified
				).run();

				console.log('Purchase record inserted:', result);
			} catch (dbError) {
				console.error('Database error storing purchase:', dbError);
				// Log the actual SQL error
				console.error('SQL Error:', dbError.message);
				throw dbError;
			}
		}

		return new Response(JSON.stringify(data), {
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders
			}
		});
	} catch (error) {
		console.error('Capture payment error:', error);
		return new Response(JSON.stringify({
			error: 'Failed to capture payment',
			details: error.message
		}), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders
			}
		});
	}
}

async function handleVerifyPayment(request, env) {
	const { apiBase } = getPayPalCredentials(env);
	const url = new URL(request.url);
	const orderID = url.pathname.split('/').pop();
	const accessToken = await getPayPalAccessToken(env);

	const response = await fetch(`${apiBase}/v2/checkout/orders/${orderID}`, {
		headers: {
			'Authorization': `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
	});

	const data = await response.json();
	return new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' },
		status: response.ok ? 200 : 400,
	});
}

async function handleDownload(request, env, corsHeaders) {
	try {
		// First authenticate the request
		const user = await authenticateRequest(request, env);
		if (!user) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), {
				status: 401,
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders
				}
			});
		}

		const url = new URL(request.url);
		const fileName = url.searchParams.get('file');

		if (!fileName) {
			return new Response(JSON.stringify({ error: 'Missing file parameter' }), {
				status: 400,
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders
				}
			});
		}

		console.log('Attempting download for user:', user.sub, 'file:', fileName);

		// Verify the user has purchased this file
		const purchase = await env.DB.prepare(`
			SELECT * FROM purchases 
			WHERE user_id = ? AND product_id = ?
		`)
		.bind(String(user.sub), fileName)
		.first();

		if (!purchase) {
			return new Response(JSON.stringify({ error: 'Purchase not found' }), {
				status: 404,
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders
				}
			});
		}

		// Convert the file name to the R2 format
		const r2FileName = `${fileName.toLowerCase()}.rbxl`;
		console.log('Looking for file in R2:', r2FileName);

		// Get the file from R2
		const file = await env.ASSET_BUCKET.get(r2FileName);
		
		if (!file) {
			return new Response(JSON.stringify({ error: 'File not found' }), {
				status: 404,
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders
				}
			});
		}

		// Update last_download timestamp
		await env.DB.prepare(`
			UPDATE purchases 
			SET last_download = CURRENT_TIMESTAMP 
			WHERE user_id = ? AND product_id = ?
		`)
		.bind(String(user.sub), fileName)
		.run();

		// Return the file with proper headers
		const headers = {
			'Content-Type': 'application/octet-stream',
			'Content-Disposition': `attachment; filename="${r2FileName}"`,
			...corsHeaders
		};

		return new Response(file.body, { headers });
	} catch (error) {
		console.error('Download error:', error);
		return new Response(JSON.stringify({
			error: 'Error processing download',
			details: error.message
		}), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders
			}
		});
	}
}

// Update your App.js to also use the correct client ID
export function getClientConfig(env) {
	const useSandbox = env.USE_SANDBOX === 'true';
	return {
		clientId: useSandbox ? env.PAYPAL_CLIENT_ID_SANDBOX : env.PAYPAL_CLIENT_ID,
		apiBase: useSandbox 
			? 'https://api-m.sandbox.paypal.com'
			: 'https://api-m.paypal.com'
	};
}

// Add an endpoint to get the PayPal configuration
async function handleGetPayPalConfig(env, corsHeaders) {
	const config = {
		clientId: env.USE_SANDBOX === 'true' 
			? env.PAYPAL_CLIENT_ID_SANDBOX 
			: env.PAYPAL_CLIENT_ID,
		isSandbox: env.USE_SANDBOX === 'true'
	};

	return new Response(JSON.stringify(config), {
		headers: {
			'Content-Type': 'application/json',
			...corsHeaders
		}
	});
}

function isAllowedOrigin(origin) {
	const allowedOrigins = [
		'https://www.skeered.net',
		'http://localhost:3000',
		'https://localhost:3000'
	];
	return allowedOrigins.includes(origin);
}

// Update the main fetch handler
export default {
	async fetch(request, env, ctx) {
		const origin = request.headers.get('Origin');
		
		// Update CORS headers
		const corsHeaders = {
			"Access-Control-Allow-Origin": isAllowedOrigin(origin) ? origin : env.CLIENT_URL,
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
			"Access-Control-Allow-Credentials": "true",
			"Access-Control-Expose-Headers": "Content-Disposition"
		};

		// Handle preflight requests
		if (request.method === "OPTIONS") {
			return new Response(null, {
				headers: corsHeaders
			});
		}

		try {
			// Initialize tables at the start
			await initializeTables(env);
			
			const url = new URL(request.url);
			const path = url.pathname;

			// Public routes - no authentication required
			if (path === '/api/auth/register') {
				return handleRegister(request, env, corsHeaders);
			}

			if (path === '/api/auth/login') {
				return handleLogin(request, env, corsHeaders);
			}

			if (path === '/api/paypal-config') {
				return handleGetPayPalConfig(env, corsHeaders);
			}

			if (path === '/api/create-paypal-order') {
				return handleCreateOrder(request, env, corsHeaders);
			}

			if (path === '/api/capture-paypal-payment') {
				return handleCapturePayment(request, env, corsHeaders);
			}

			// Add Roblox API endpoints to public routes
			if (path === '/api/games') {
				const universeIds = url.searchParams.get('universeIds');
				const res = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeIds}`);
				const data = await res.json();
				return new Response(JSON.stringify(data), {
					headers: {
						"Content-Type": "application/json",
						...corsHeaders
					}
				});
			}

			if (path === '/api/thumbnails') {
				const universeIds = url.searchParams.get('universeIds');
				const res = await fetch(`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeIds}&size=768x432&format=Png&isCircular=false`);
				const data = await res.json();
				return new Response(JSON.stringify(data), {
					headers: {
						"Content-Type": "application/json",
						...corsHeaders
					}
				});
			}

			// Protected routes - require authentication
			const user = await authenticateRequest(request, env);
			if (!user) {
				return new Response('Unauthorized', { 
					status: 401,
					headers: corsHeaders
				});
			}

			if (path === '/api/user/purchases') {
				return handleGetUserPurchases(request, env, corsHeaders);
			}

			if (path === '/api/download') {
				return handleDownload(request, env, corsHeaders);
			}

			if (path === '/api/auth/verify') {
				return handleVerifyAuth(request, env, corsHeaders);
			}

			return new Response('Not found', { 
				status: 404,
				headers: corsHeaders
			});
		} catch (error) {
			console.error('Server error:', error);
			return new Response(JSON.stringify({ 
				error: 'Internal server error',
				details: error.message 
			}), {
				status: 500,
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders
				}
			});
		}
	}
}

// Helper function to add CORS headers to responses
function addCorsHeaders(response, corsHeaders) {
	const newHeaders = new Headers(response.headers);
	Object.entries(corsHeaders).forEach(([key, value]) => {
		newHeaders.set(key, value);
	});

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: newHeaders,
	});
}

async function handleVerifyAuth(request, env, corsHeaders) {
	try {
		const user = await authenticateRequest(request, env);
		if (!user) {
			return new Response('Unauthorized', { 
				status: 401,
				headers: corsHeaders
			});
		}

		return new Response(JSON.stringify({ 
			verified: true,
			email: user.email 
		}), {
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({ 
			error: 'Verification failed',
			details: error.message 
		}), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				...corsHeaders
			}
		});
	}
}

// Update the users table schema to ensure ID is TEXT
async function initializeTables(env) {
	try {
		// Create users table
		await env.DB.prepare(`
			CREATE TABLE IF NOT EXISTS users (
				id TEXT PRIMARY KEY,
				email TEXT UNIQUE NOT NULL,
				password_hash TEXT NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)
		`).run();

		// Create purchases table with matching user_id type
		await env.DB.prepare(`
			CREATE TABLE IF NOT EXISTS purchases (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				user_id TEXT NOT NULL,
				order_id TEXT NOT NULL,
				product_id TEXT NOT NULL,
				purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
				last_download DATETIME,
				FOREIGN KEY (user_id) REFERENCES users(id)
			)
		`).run();

		console.log('Database tables initialized');
	} catch (error) {
		console.error('Error initializing tables:', error);
		throw error;
	}
}
  