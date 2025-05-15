
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { ChatbotProvider } from '../../contexts/ChatbotContext';
import Chatbot from '../Chatbot';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <ChatbotProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Chatbot />
        <Footer />
      </div>
    </ChatbotProvider>
  );
};

export default Layout;
