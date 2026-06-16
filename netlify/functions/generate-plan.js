// FILE 3: save as generate-plan.js (goes inside netlify/functions/)
// This runs on Netlify's servers, keeping your API key secret.

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const { prompt } = JSON.parse(event.body);

    if (!prompt || typeof prompt !== "string" || prompt.length > 8000) {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid request" }) };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }]
      })
    });

    clearTimeout(timeout);

    const responseText = await response.text();

    if (!response.ok) {
      console.error("Anthropic API error:", response.status, responseText);
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "AI generation failed", detail: responseText })
      };
    }

    const data = JSON.parse(responseText);
    const text = data.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ text })
    };

  } catch (err) {
    console.error("Function error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", detail: err.message })
    };
  }
};
