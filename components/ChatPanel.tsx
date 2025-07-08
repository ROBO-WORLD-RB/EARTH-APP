import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import SendIcon from './icons/SendIcon';
import BotIcon from './icons/BotIcon';
import UserIcon from './icons/UserIcon';
import EarthIcon from './icons/EarthIcon';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isModel = message.role === 'model';
  return (
    <div className={`flex items-start gap-4 ${isModel ? '' : 'flex-row-reverse'}`}>
      {isModel ? <BotIcon /> : <UserIcon />}
      <div className={`flex flex-col ${isModel ? 'items-start' : 'items-end'}`}>
        <div
          className={`max-w-2xl lg:max-w-3xl ${
            isModel 
              ? '' // No "box" for AI replies, for a cleaner, document-like style.
              : 'px-5 py-3 rounded-2xl shadow-sm bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-br-none'
          }`}
        >
          {isModel ? (
            <div className="text-[17px] leading-relaxed pt-1 text-gray-700 dark:text-gray-300 text-justify">
               <ReactMarkdown
                components={{
                  p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-outside pl-5 my-4 space-y-2" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-outside pl-5 my-4 space-y-2" {...props} />,
                  li: ({node, ...props}) => <li className="pl-2 mb-1" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-3" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-5 mb-2" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
                  code: ({ node, inline, className, children, ...props }: any) => {
                    if (inline) {
                      return <code className="bg-gray-100 dark:bg-gray-700/50 rounded-sm px-1.5 py-1 font-mono text-sm" {...props}>{children}</code>;
                    }
                    return (
                      <pre className="bg-gray-100 dark:bg-gray-800/50 rounded-md p-4 my-4 overflow-x-auto">
                        <code className="font-mono text-sm" {...props}>{children}</code>
                      </pre>
                    );
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-[17px]">{message.content}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 flex flex-col h-full w-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 dark:text-gray-500 pt-20 flex flex-col items-center">
            <EarthIcon className="w-20 h-20 mb-4" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">EARTH</h1>
            <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mt-2">AI Brain Studio</h2>
            <p className="mt-4">Set the AI Brain and send a message to begin!</p>
            <p className="text-sm mt-1">Hover on the top-left button to open settings.</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && messages[messages.length -1]?.role === 'user' && (
           <div className="flex items-start gap-4">
            <BotIcon />
            <div className="px-5 py-4 rounded-2xl bg-gray-100 dark:bg-gray-800 rounded-bl-none">
              <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
              </div>
            </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
        <div className="relative max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Talk to your custom AI..."
            rows={1}
            className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full py-3 pl-5 pr-16 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:outline-none resize-none transition-all duration-200"
            disabled={isLoading}
            style={{paddingTop: '0.8rem', paddingBottom: '0.8rem'}}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all"
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;