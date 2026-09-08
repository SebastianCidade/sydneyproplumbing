export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const body = await request.json();
        const messages = body.messages || [];

        if (!env.OPENAI_API_KEY) {
          return new Response(
            JSON.stringify({
              error: "OPENAI_API_KEY is not connected to this Worker."
            }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
        }

        const response = await fetch(
          "https://api.openai.com/v1/responses",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: "gpt-5-mini",
              instructions: `
You are the AI receptionist for Sydney Pro Plumbing in Sydney, NSW.

Be friendly, professional and concise.

Help customers with plumbing enquiries.

Ask useful questions to understand the plumbing problem.

When appropriate, collect:
- Customer name
- Phone number
- Suburb
- Description of the plumbing problem
- Preferred time for a plumber

Do not claim a booking has been made unless a real booking has been confirmed.

Do not invent prices, availability or services.

If there is an immediate dangerous situation, tell the customer to stay safe and contact emergency services if necessary.

Once you have enough information, explain that their enquiry can be submitted so Sydney Pro Plumbing can contact them.
`,
              input: messages
            })
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return new Response(
            JSON.stringify({
              error: data.error?.message || "OpenAI rejected the request."
            }),
            {
              status: response.status,
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
        }

        return new Response(
          JSON.stringify({
            reply: data.output_text || "I couldn't generate a response."
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

      } catch (error) {
        return new Response(
          JSON.stringify({
            error: error.message || "Something went wrong."
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};
