"use server"
export default async function AskAi(mess,model) {
  try{
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
        "messages": [
          {
            role:"user",
            content:`${mess}` 
          }
        ]
      })
    });
    if(!data.ok){
      throw new Error("There was an error fetching the data")
    }
    const response = await data.json();
    console.log("message",response);


    return response.choices[0].message.content;

  }catch(error){
    return ("sorry there was an error loading your result. Try a different model")
  }
      }
