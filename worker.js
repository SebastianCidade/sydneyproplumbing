export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      return Response.json({
        reply: "WORKER TEST SUCCESS"
      });
    }

    return env.ASSETS.fetch(request);
  }
};
