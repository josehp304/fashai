"use client"
import React, { useState, useRef, useEffect } from "react";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Page() {
  let [aiMessage, setAiMessage] = useState("");
  let [aiResponse, setAiResponse] = useState("waiting for ai response");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [aiMessage]);

  async function askAi(mess) {
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

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} font-sans`}>
      <button 
        className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        onClick={() => setIsDarkMode(!isDarkMode)}
      >
        Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
      </button>

      <h1 className="text-4xl font-bold mb-8">Polyadi GPT</h1>
      <section className={`w-full max-w-2xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-lg p-6`}>
        <div className="flex flex-col">
          <form className="flex flex-col space-y-4">
            <textarea 
              ref={textareaRef}
              className={`w-full p-4 border ${isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden`} 
              onChange={(e) => setAiMessage(e.target.value)}  
              placeholder="Type your message here"
              value={aiMessage}
            />
            <button 
              type='button'  
              className="self-end px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300" 
              onClick={async (e) => {
                setAiResponse("loading...");
                setAiResponse(await askAi(aiMessage));
                console.log('clicked');
              }}
            >
              Send
            </button>
          </form>
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-3">AI Response</h2>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}>
              <Markdown remarkPlugins={[remarkGfm]}>{aiResponse}</Markdown>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}