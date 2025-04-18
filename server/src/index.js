export default {
	async fetch(request, env, ctx) {
	  const url = new URL(request.url);
	  const path = url.pathname;
	  const universeIds = url.searchParams.get('universeIds');
  
	  const corsHeaders = {
		"Access-Control-Allow-Origin": "*", // oppure specifica il tuo dominio
		"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
		"Access-Control-Allow-Headers": "*",
	  };
  
	  // Pre-flight request (browser fa una OPTIONS per controllare i permessi)
	  if (request.method === "OPTIONS") {
		return new Response(null, {
		  headers: corsHeaders
		});
	  }
  
	  try {
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
  
		return new Response("Not found", {
		  status: 404,
		  headers: corsHeaders
		});
	  } catch (err) {
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
  