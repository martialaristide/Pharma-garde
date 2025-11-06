import React, { useState, useRef, useEffect, useContext } from 'react';
import type { ChatMessage } from '../types';
import { postChatMessage } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'model',
          content: "Bonjour ! Je suis Pharma-Conseil, votre assistant IA. Comment puis-je vous aider aujourd'hui ? Je peux vous donner des informations sur des symptômes courants ou vous aider à trouver un établissement. \n\n**Attention :** Je ne suis pas un professionnel de santé et mes conseils ne remplacent pas un avis médical.",
        },
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const responseData = await postChatMessage(messages, currentInput);
      const modelMessage: ChatMessage = { role: 'model', content: responseData.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error('Error with AI service:', error);
      const errorMessage: ChatMessage = {
        role: 'model',
        content: `Désolé, une erreur s'est produite. ${error instanceof Error ? error.message : ''}. Veuillez réessayer plus tard.`,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      ></div>
      <div className="fixed bottom-0 left-0 right-0 h-[90%] bg-white rounded-t-2xl shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out sm:max-w-md sm:mx-auto sm:left-auto sm:right-4 sm:bottom-4 sm:h-[600px] sm:rounded-2xl">
        <header className="p-4 border-b flex items-center gap-4 flex-shrink-0">
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-2 rounded-full leading-none h-10 w-10 flex items-center justify-center">
                <i className="fa-solid fa-arrow-left text-xl"></i>
            </button>
            <div className="flex items-center">
                <i className="fa-solid fa-robot text-2xl text-teal-600 mr-3"></i>
                <div>
                    <h2 className="text-lg font-bold text-gray-800">Pharma-Conseil</h2>
                     <div className="flex items-center">
                        <p className="text-xs text-gray-500 mr-2">Assistant d'orientation IA</p>
                        {user?.membership === 'premium' && (
                            <span className="text-xs font-bold bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full flex items-center">
                                <i className="fa-solid fa-star text-yellow-500 mr-1"></i>
                                PREMIUM
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </header>

        <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-teal-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 rounded-2xl rounded-bl-none px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="p-4 border-t bg-white flex-shrink-0">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez votre question ici..."
              className="flex-1 px-4 py-2 border rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-teal-600 text-white rounded-full h-10 w-10 flex items-center justify-center transition-opacity disabled:opacity-50 flex-shrink-0"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AIAssistant;