export default {
	async fetch(request, env, ctx) {
	  // Lista di origini permesse (aggiungi tutti i domini necessari)
	  const allowedOrigins = [
		"https://www.skeered.net",
		"https://build-p2n1-4vmjxpur0-christian-zucconis-projects.vercel.app",
		"http://localhost:3000" // Per sviluppo locale
	  ];
  
	  // Ottieni l'origin dalla richiesta
	  const requestOrigin = request.headers.get("Origin");
	  const origin = allowedOrigins.includes(requestOrigin) ? requestOrigin : allowedOrigins[0];
  
	  // Headers CORS dinamici
	  const corsHeaders = {
		"Access-Control-Allow-Origin": origin,
		"Access-Control-Allow-Methods": "GET, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
		"Access-Control-Max-Age": "86400", // Cache preflight per 24h
	  };
  
	  // Gestione preflight request
	  if (request.method === "OPTIONS") {
		return new Response(null, {
		  headers: {
			...corsHeaders,
			"Vary": "Origin" // Importante per cache diversi per origin
		  }
		});
	  }
  
	  const url = new URL(request.url);
	  const path = url.pathname;
	  const universeIds = url.searchParams.get('universeIds');
  
	  try {
		let response;
		
		if (path === "/api/games") {
		  response = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeIds}`);
		} else if (path === "/api/thumbnails") {
		  response = await fetch(`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeIds}&size=768x432&format=Png&isCircular=false`);
		} else {
		  return new Response("Not found", { 
			status: 404,
			headers: corsHeaders
		  });
		}
  
		const data = await response.json();
  
		return new Response(JSON.stringify(data), {
		  headers: {
			...corsHeaders,
			"Content-Type": "application/json",
			"Vary": "Origin" // Necessario per CORS dinamico
		  }
		});
  
	  } catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
		  status: 500,
		  headers: {
			...corsHeaders,
			"Content-Type": "application/json"
		  }
		});
	  }
	}
  }