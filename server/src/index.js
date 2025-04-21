// Instead, create a function to get the API base
function getPayPalApiBase(env) {
	return env.NODE_ENV === 'production'
		? 'https://api-m.paypal.com'
		: 'https://api-m.sandbox.paypal.com';
}

async function getPayPalAccessToken(env) {
	const PAYPAL_API_BASE = getPayPalApiBase(env);
	const auth = btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`);
	
	const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
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

async function handleCreateOrder(request, env) {
	const PAYPAL_API_BASE = getPayPalApiBase(env);
	const { items } = await request.json();
	const accessToken = await getPayPalAccessToken(env);

	// Calculate total from items
	const total = items.reduce((sum, item) => sum + (item.price * item.quantity) / 100, 0);

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
			brand_name: 'Your Shop Name',
			landing_page: 'NO_PREFERENCE',
			user_action: 'PAY_NOW',
			return_url: `${env.CLIENT_URL}/success`,
			cancel_url: `${env.CLIENT_URL}/cancel`,
		},
	};

	const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(order),
	});

	const data = await response.json();
	return new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' },
		status: response.ok ? 200 : 400,
	});
}

async function handleCapturePayment(request, env) {
	const PAYPAL_API_BASE = getPayPalApiBase(env);
	const { orderID } = await request.json();
	const accessToken = await getPayPalAccessToken(env);

	const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
		method: 'POST',
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

async function handleVerifyPayment(request, env) {
	const PAYPAL_API_BASE = getPayPalApiBase(env);
	const url = new URL(request.url);
	const orderID = url.pathname.split('/').pop();
	const accessToken = await getPayPalAccessToken(env);

	const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}`, {
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

export default {
	async fetch(request, env, ctx) {
		const corsHeaders = {
			"Access-Control-Allow-Origin": "*", // or env.CLIENT_URL if you want to be more restrictive
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		};

		if (request.method === "OPTIONS") {
			return new Response(null, {
				headers: corsHeaders
			});
		}

		try {
			const url = new URL(request.url);
			const path = url.pathname;
			const universeIds = url.searchParams.get('universeIds');

			if (path === "/api/games") {
				const res = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeIds}`);
				const data = await res.json();
				return new Response(JSON.stringify(data), {
					headers: {
						"Content-Type": "application/json",
						...corsHeaders
					}
				});
			}

			if (path === "/api/thumbnails") {
				const res = await fetch(`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeIds}&size=768x432&format=Png&isCircular=false`);
				const data = await res.json();
				return new Response(JSON.stringify(data), {
					headers: {
						"Content-Type": "application/json",
						...corsHeaders
					}
				});
			}

			if (path === '/api/create-paypal-order' && request.method === 'POST') {
				const response = await handleCreateOrder(request, env);
				return addCorsHeaders(response, corsHeaders);
			}
			
			if (path === '/api/capture-paypal-payment' && request.method === 'POST') {
				const response = await handleCapturePayment(request, env);
				return addCorsHeaders(response, corsHeaders);
			}
			
			if (path.startsWith('/api/verify-payment/') && request.method === 'GET') {
				const response = await handleVerifyPayment(request, env);
				return addCorsHeaders(response, corsHeaders);
			}

			return new Response("Not found", {
				status: 404,
				headers: corsHeaders
			});
		} catch (err) {
			console.error('Worker error:', err);
			return new Response(JSON.stringify({ error: err.message }), {
				status: 500,
				headers: {
					"Content-Type": "application/json",
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
  