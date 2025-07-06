import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, User, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { InvokeLLM } from "@/api/integrations";

export default function Chatbot({ experience, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    setMessages([
      { sender: 'bot', text: `שלום! אני שרי, מומחית התיירות האישית שלך. איך אני יכולה לעזור לך לגבי חווית "${experience.name}"?` }
    ]);
  }, [experience]);
  
  useEffect(() => {
    // scroll to bottom
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const context = `
            You are Sherry, a world-class travel expert. Your knowledge of flights, hotels, and destinations is encyclopedic.
            Your tone is intelligent, respectful, and very polite. Your answers must be short, clear, and to the point.
            You must provide real, factual information.
            For this demo, you will get information from the web. In production, you'll be connected to live APIs.
            The user is currently interested in a vacation package with the following theme:
            ${JSON.stringify(experience, null, 2)}

            Based on this theme, answer the user's question.
        `;
        
        const prompt = `${context}\n\nUser Question: "${input}"`;

        const response = await InvokeLLM({ prompt, add_context_from_internet: true });
        
        let botResponseText = response;
        if(typeof response === 'object' && response.response) {
            botResponseText = response.response;
        }

        const botMessage = { sender: 'bot', text: botResponseText };
        setMessages(prev => [...prev, botMessage]);

    } catch (error) {
        console.error("Error invoking LLM:", error);
        const errorMessage = { sender: 'bot', text: 'מצטערת, אירעה שגיאה. אנא נסה שוב בעוד רגע.' };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" dir="rtl">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col h-[80vh] sherry-glow"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <img src={experience.character_image_url} alt="Sherry" className="w-12 h-12 object-contain" />
            <div>
                <h3 className="font-bold text-lg text-gray-800">שיחה עם שרי</h3>
                <p className="text-sm text-gray-500">לגבי: {experience.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && <Bot className="w-6 h-6 text-amber-500 flex-shrink-0" />}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.sender === 'user' ? 'bg-amber-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                    {msg.text}
                  </div>
                   {msg.sender === 'user' && <User className="w-6 h-6 text-gray-400 flex-shrink-0" />}
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
               <div className="flex justify-start">
                   <div className="bg-gray-100 rounded-2xl px-4 py-2 rounded-bl-none flex items-center gap-2">
                       <Loader className="w-4 h-4 animate-spin"/>
                       <span>חושבת...</span>
                   </div>
               </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="relative">
            <Input 
              placeholder="כתוב הודעה..." 
              className="pr-12"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <Button 
              size="icon" 
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-amber-500 hover:bg-amber-600"
              onClick={handleSend}
              disabled={isLoading}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}