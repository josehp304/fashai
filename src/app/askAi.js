"use server"
export default async function AskAi(mess) {
    const data = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPEN_ROUTER_API}`,
        // "HTTP-Referer": "", // Optional. Site URL for rankings on openrouter.ai.
        // "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-r1-distill-llama-70b:free",
        "messages": [
          {
            role: "user",
            content:`${mess}` 
          }
        ]
      })
    });
    const response = await data.json();
    console.log("message",response);

    return response.choices[0].message.content;
  }
