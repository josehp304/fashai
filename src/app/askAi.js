"use server"
export default async function AskAi(chatLog,model) {
  try{
    console.log("chatLog",chatLog);
    const data = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPEN_ROUTER_API}`,
        // "HTTP-Referer": "", // Optional. Site URL for rankings on openrouter.ai.
        // "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": `${model}`,
        "messages": chatLog,
      })
    });
    if(!data.ok){
      throw new Error("There was an error fetching the data")
    }
    const response = await data.json();
    console.log("message",response.choices[0].message.content);


    return response.choices[0].message.content;

  }catch(error){
    return ("sorry there was an error loading your result. Try a different model")
  }
      }
