export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {

        if (!env.OPENAI_API_KEY) {
          return Response.json({
            reply: "TEST ERROR: OPENAI_API_KEY is not connected."
          });
        }

        const response = await fetch(
          "https://api.openai.com/v1/responses",
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: "gpt-5-mini",
              input: "Say exactly: OPENAI CONNECTION SUCCESS"
            })
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return Response.json({
            reply:
              "OPENAI ERROR: " +
              (data?.error?.message || JSON.stringify(data))
          });
        }

        return Response.json({
          reply: data.output_text || "OpenAI responded but no text was found."
        });

      } catch (error) {
        return Response.json({
          reply: "WORKER ERROR: " + error.message
        });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
