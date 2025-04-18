export default {
	async fetch(request, env, ctx) {
	  const url = new URL(request.url);
	  const path = url.pathname;
	  const universeIds = url.searchParams.get('universeIds');
  
	  if (path === "/api/games") {
		const res = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeIds}`);
		const data = await res.json();
		return new Response(JSON.stringify(data), {
		  headers: { "Content-Type": "application/json" }
		});
	  }
  
	  if (path === "/api/thumbnails") {
		const res = await fetch(`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeIds}&size=768x432&format=Png&isCircular=false`);
		const data = await res.json();
		return new Response(JSON.stringify(data), {
		  headers: { "Content-Type": "application/json" }
		});
	  }
  
	  return new Response("Not found", { status: 404 });
	}
  }
  