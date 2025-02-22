"use client"
import React, { useState, useRef, useEffect } from "react";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AskAi from './askAi';
import { Popover,PopoverAnchor,PopoverContent,PopoverTrigger } from "@/components/ui/popover";
import { Command,CommandDialog,CommandEmpty,CommandGroup,CommandInput,CommandItem,CommandList,CommandSeparator } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
export default function Page() {
  let [aiMessage, setAiMessage] = useState("");
  let [aiResponse, setAiResponse] = useState();
  let [chatLog,setChatLog] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [model, setModel] = useState("openchat/openchat-7b:free");
  const [popOpen, setPopOpen] = useState(false);
  const textareaRef = useRef(null);

  const models = [ {id:"meta-llama/llama-3.3-70b-instruct:free",label:"Llama-3.3-70b"},
    {id:"deepseek/deepseek-r1:free",label:"Deepseek-r1"},{id:"google/gemini-2.0-flash-exp:free",label:"Gemini-2.0-flash-exp"},
    {id:"mistralai/mistral-nemo:free",label:"Mistral-nemo"},{id:"openchat/openchat-7b:free",label:"Openchat-7b (lowest latency)"},
    {id:"deepseek/deepseek-chat:free",label:"Deepseek V3"},{id:"google/gemini-2.0-flash-thinking-exp:free",label:"Gemini-2.0-flash (thinking exp)"}]

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

  }, [aiMessage]);

 
  return (
    <div className={`flex  flex-col items-center justify-center  min-h-screen overflow-hidden ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} font-sans`}>
      <button 
        className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        onClick={() => setIsDarkMode(!isDarkMode)}
      >
        Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
      </button>

      <h1 className={`absolute top-0 left-20 mt-10 text-4xl  font-bold mb-8 ${chatLog.length?'hidden':''}`}>Skibidy GPT</h1>
      <section className={`w-full max-w-6xl mb-10 mt-auto  ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-lg p-6`}>
        <div className="flex flex-col  ">
        <div className="mt-6">

            <h2 className={`text-2xl font-semibold mb-3 ${aiResponse?"":"hidden"}`}  >AI Response</h2>
            {
              chatLog.map((chat,index)=>{
                return(
                  <div key={index} className={`flex flex-col gap-2 pt-5 ${chat.role=="user"?"items-end":"items-start"}`}>
                    <div className={`p-4 rounded-lg ${chat.role=="user"?"bg-blue-500 text-white":"bg-gray-300 text-gray-900"}`}>{chat.content}</div>
                  </div>
                )
              }
            )
            }
            
          </div>
          <form className="relative flex flex-col items-center justify-center sm:flex-row h-full  gap-2   space-y-4">
            <textarea 
              ref={textareaRef}
              className={`w-full p-4 border ${isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden`} 
              onChange={(e) => setAiMessage(e.target.value)}  
              placeholder="Type your message here"
              value={aiMessage}
            />
           
       
            <button 
              type='button'  
              className="w-full sm:absolute right-2   sm:w-auto   px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300 " 
              onClick={async (e) => {
                setChatLog((prevChats)=>[...prevChats,{role:"user",content:aiMessage}])
                setAiResponse("loading...");
                setAiResponse(await AskAi([...chatLog,{role:"user",content:aiMessage}],model));
                setChatLog((prevChats)=>[...prevChats,{role:"assistant",content:aiResponse}])
                setAiMessage("")
                console.log('clicked');
              }}
            >
              Send
            </button>
      
            
          </form>
          <div></div>
          <Popover  open={popOpen} onOpenChange={setPopOpen}>
              <PopoverTrigger  asChild>
                <Button >
              {
                models.find((m)=>m.id==model)?.label
                }
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
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
          
        </div>
      </section>
    </div>
  );
}