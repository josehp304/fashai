"use client"
import React, { useState, useRef, useEffect } from "react";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AskAi from './askAi';
import { Popover,PopoverAnchor,PopoverContent,PopoverTrigger } from "@/components/ui/popover";
import { Command,CommandDialog,CommandEmpty,CommandGroup,CommandInput,CommandItem,CommandList,CommandSeparator } from "@/components/ui/command";
import { Button } from "@/components/ui/button";

export default function Page() {
  let [aiMessage, setAiMessage] = useState("");
  let [aiResponse, setAiResponse] = useState("waiting for ai response");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [model, setModel] = useState("meta-llama/llama-3.3-70b-instruct:free");
  const [popOpen, setPopOpen] = useState(false);
  const textareaRef = useRef(null);

  const models = [ {id:"meta-llama/llama-3.3-70b-instruct:free",label:"llama-3.3-70b"},{id:"deepseek/deepseek-r1:free",label:"deepseek-r1"},{id:"google/gemini-2.0-flash-exp:free",label:"gemini-2.0-flash-exp"},{id:"mistralai/mistral-nemo:free",label:"mistral-nemo"}]

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

  }, [aiMessage]);

 
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen pt-[50vh] ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} font-sans`}>
      <button 
        className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        onClick={() => setIsDarkMode(!isDarkMode)}
      >
        Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
      </button>

      <h1 className="text-4xl font-bold mb-8">Polyadi GPT</h1>
      <section className={`w-full max-w-2xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-lg p-6`}>
        <div className="flex flex-col">
          <form className="flex flex-col sm:flex-row  gap-2 item-center space-y-4  ">
            <textarea 
              ref={textareaRef}
              className={`w-full p-4 border ${isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden`} 
              onChange={(e) => setAiMessage(e.target.value)}  
              placeholder="Type your message here"
              value={aiMessage}
            />
           
       
            <button 
              type='button'  
              className="w-full sm:w-auto self-end  px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300 " 
              onClick={async (e) => {
                setAiResponse("loading...");
                setAiResponse(await AskAi(aiMessage,model));
                setAiMessage("")
                console.log('clicked');
              }}
            >
              Send
            </button>
      
            
          </form>
          <div></div>
          <Popover className="w-full" open={popOpen} onOpenChange={setPopOpen}>
              <PopoverTrigger  asChild>
                <Button >
              {
                models.find((m)=>m.id==model)?.label
                }
                </Button>
                </PopoverTrigger>
              <PopoverContent>
                <Command>
                  <CommandInput placeholder="Search models" />
                  <CommandList>
                    <CommandEmpty>no models found</CommandEmpty>
                    <CommandGroup title="Models">
                      {
                        models.map((model)=>{
                          return(<CommandItem key={model.id} value={model.label} onSelect={()=>{setModel(model.id) 
                            setPopOpen(false) 
                          } } >{model.label}</CommandItem>)
                        })
                      }
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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