
import { useState, useRef, useEffect } from 'react';
import { useChatbot } from '../contexts/ChatbotContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const Chatbot = () => {
  const { messages, addUserMessage, predefinedQuestions } = useChatbot();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);
  
  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    await addUserMessage(input);
    setInput('');
  };
  
  const handleQuickQuestion = async (question: string) => {
    await addUserMessage(question);
  };
  
  return (
    <>
      {/* Chatbot Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button 
          onClick={() => setIsOpen(!isOpen)}
          className={`rounded-full w-14 h-14 shadow-lg flex items-center justify-center transition-transform hover:scale-105 ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-garage-blue hover:bg-garage-darkBlue'}`}
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-circle">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          )}
        </Button>
      </div>
      
      {/* Chatbot Window */}
      <div 
        className={`fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-xl z-40 transition-all duration-300 transform chatbot-container ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        {/* Chat Header */}
        <div className="bg-garage-blue text-white p-4 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-garage-blue">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Auto Shop Assistant</h3>
              <p className="text-xs text-blue-100">Ask me anything about our services</p>
            </div>
          </div>
        </div>
        
        {/* Messages Area */}
        <ScrollArea className="h-80 p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-3 text-gray-400">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <p className="text-center">Welcome to our virtual assistant! How can I help you today?</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${
                    message.sender === 'user' ? 'ml-auto bg-blue-100' : 'mr-auto bg-gray-100'
                  } max-w-[80%] rounded-lg p-3 animate-fade-in`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
        
        {/* Quick Questions */}
        {messages.length === 0 && (
          <div className="px-4 py-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Frequently asked questions:</p>
            <div className="flex flex-wrap gap-2">
              {predefinedQuestions.slice(0, 3).map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleQuickQuestion(q.question)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
                >
                  {q.question.length > 20 ? q.question.substring(0, 20) + '...' : q.question}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Input Area */}
        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
          <div className="flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Button 
              type="submit" 
              className="rounded-l-none bg-garage-blue hover:bg-garage-darkBlue"
              disabled={!input.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-send">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Chatbot;
