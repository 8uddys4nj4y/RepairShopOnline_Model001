
import React, { createContext, useState, useContext, useEffect } from 'react';

// Define types
export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface ChatbotQuestion {
  id: string;
  question: string;
  answer: string;
}

interface ChatbotContextProps {
  messages: ChatMessage[];
  predefinedQuestions: ChatbotQuestion[];
  addUserMessage: (text: string) => Promise<void>;
  clearChat: () => void;
  addPredefinedQuestion: (question: ChatbotQuestion) => void;
  updatePredefinedQuestion: (id: string, question: string, answer: string) => void;
  deletePredefinedQuestion: (id: string) => void;
}

// Initial predefined questions
const initialQuestions: ChatbotQuestion[] = [
  {
    id: '1',
    question: 'What services do you offer?',
    answer: 'We offer a wide range of services including oil changes, brake repairs, engine diagnostics, tire services, and more. You can check our services page for a complete listing.'
  },
  {
    id: '2',
    question: 'How do I book an appointment?',
    answer: 'You can book an appointment through our online booking system. Simply go to the booking page, select the service you need, choose an available date and time, and fill out your contact information.'
  },
  {
    id: '3',
    question: 'What are your hours of operation?',
    answer: 'We are open Monday through Friday from 8:00 AM to 6:00 PM, Saturday from 9:00 AM to 3:00 PM, and closed on Sundays.'
  },
  {
    id: '4',
    question: 'Do you offer warranty on repairs?',
    answer: 'Yes, we offer a 12-month/12,000-mile warranty on most repairs and services. Please ask our service advisor for specific warranty information on your repair.'
  },
  {
    id: '5',
    question: 'How long does an oil change take?',
    answer: 'A standard oil change typically takes about 30 minutes. However, wait times may vary depending on how busy we are.'
  }
];

// Create context
const ChatbotContext = createContext<ChatbotContextProps | undefined>(undefined);

// Provider component
export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [predefinedQuestions, setPredefinedQuestions] = useState<ChatbotQuestion[]>(initialQuestions);

  // Load data from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatbotMessages');
    const savedQuestions = localStorage.getItem('predefinedQuestions');
    
    if (savedMessages) setMessages(JSON.parse(savedMessages));
    if (savedQuestions) setPredefinedQuestions(JSON.parse(savedQuestions));
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('chatbotMessages', JSON.stringify(messages));
    localStorage.setItem('predefinedQuestions', JSON.stringify(predefinedQuestions));
  }, [messages, predefinedQuestions]);

  // Add a user message and get a bot response
  const addUserMessage = async (text: string): Promise<void> => {
    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Find a matching question
    const matchingQuestion = predefinedQuestions.find(q => 
      q.question.toLowerCase().includes(text.toLowerCase()) ||
      text.toLowerCase().includes(q.question.toLowerCase())
    );
    
    // Generate bot response (after a small delay)
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: matchingQuestion 
          ? matchingQuestion.answer 
          : "I'm sorry, I don't have an answer for that question. Please contact our shop for more information.",
        timestamp: new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
    }, 600);
  };
  
  // Clear chat history
  const clearChat = () => {
    setMessages([]);
  };
  
  // Add a new predefined question
  const addPredefinedQuestion = (question: ChatbotQuestion) => {
    setPredefinedQuestions([...predefinedQuestions, question]);
  };
  
  // Update an existing predefined question
  const updatePredefinedQuestion = (id: string, question: string, answer: string) => {
    setPredefinedQuestions(predefinedQuestions.map(q => 
      q.id === id ? { ...q, question, answer } : q
    ));
  };
  
  // Delete a predefined question
  const deletePredefinedQuestion = (id: string) => {
    setPredefinedQuestions(predefinedQuestions.filter(q => q.id !== id));
  };
  
  return (
    <ChatbotContext.Provider value={{
      messages,
      predefinedQuestions,
      addUserMessage,
      clearChat,
      addPredefinedQuestion,
      updatePredefinedQuestion,
      deletePredefinedQuestion
    }}>
      {children}
    </ChatbotContext.Provider>
  );
};

// Custom hook
export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};
