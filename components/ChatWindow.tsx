import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isLoading }) => {
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() && !isLoading) {
      onSendMessage(userInput.trim());
      setUserInput('');
    }
  };
  
  const formatMarkdown = (text: string) => {
    if (!text) return '';
    return text
      .replace(/^### (.*$)/gim, '<h3 class="text-md font-semibold mt-2 mb-1">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg shadow-2xl">
      <div className="p-4 bg-gray-900/50 rounded-t-lg">
        <h2 className="text-xl font-bold text-cyan-400">Profesor Elemento</h2>
        <p className="text-sm text-gray-400">Tutor kimia pribadi Anda</p>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-700 text-gray-200 rounded-bl-none'
                }`}
              >
                <div className="text-sm" dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.text) }}></div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end justify-start">
              <div className="max-w-xs px-4 py-3 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none flex items-center space-x-2">
                 <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-0"></span>
                 <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></span>
                 <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 bg-gray-900/50 rounded-b-lg">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Tanyakan tentang elemen atau konsep..."
            disabled={isLoading}
            className="flex-grow px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="px-5 py-2 bg-cyan-600 text-white font-semibold rounded-full hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;