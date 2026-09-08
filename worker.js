export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // AI CHAT ENDPOINT
    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const body = await request.json();
        const messages = body.messages || [];

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

Your job is to help customers with plumbing enquiries.

Be friendly, professional and concise.

Understand what the customer needs and ask useful follow-up questions.

When appropriate, collect:
- Customer name
- Phone number
- Suburb
- Description of the plumbing problem
- Preferred time for a plumber

Do not claim that a plumber has been booked unless a real booking has been confirmed.

Do not invent prices, availability or services.

If the customer describes an immediate dangerous situation, advise them to stay safe and contact emergency services if there is immediate danger.

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
              error: data.error?.message || "AI request failed"
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
            reply: data.output_text || "Sorry, I couldn't generate a response."
          }),
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

      } catch (error) {
        return new Response(
          JSON.stringify({
            error: "Something went wrong."
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

    // SERVE YOUR EXISTING WEBSITE
    return env.ASSETS.fetch(request);
  }
};
