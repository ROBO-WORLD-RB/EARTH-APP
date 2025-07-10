
import React, { useState, useEffect } from 'react';
import { Conversation } from '../types';
import SaveIcon from './icons/SaveIcon';
import ClearIcon from './icons/ClearIcon';
import ThemeToggleButton from './ThemeToggleButton';
import EarthIcon from './icons/EarthIcon';
import NewChatIcon from './icons/NewChatIcon';

interface SidePanelProps {
  isVisible: boolean;
  initialInstruction: string;
  onSave: (instruction: string) => void;
  onClear: () => void;
  saveStatus: 'idle' | 'saving' | 'saved';
  conversations: Conversation[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat?: (id: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ isVisible, initialInstruction, onSave, onClear, saveStatus, conversations, activeChatId, onNewChat, onSelectChat, onDeleteChat, theme, onToggleTheme }) => {
  const [instruction, setInstruction] = useState(initialInstruction);

  useEffect(() => {
    setInstruction(initialInstruction);
  }, [initialInstruction]);

  const handleSave = () => onSave(instruction);
  const handleClear = () => {
    setInstruction('');
    onClear();
  };
  
  const getStatusMessage = () => {
    switch (saveStatus) {
      case 'saving':
        return <span className="text-yellow-600 dark:text-yellow-400">Applying...</span>;
      case 'saved':
        return <span className="text-green-600 dark:text-green-400">Brain settings applied!</span>;
      default:
        return null;
    }
  };

  return (
    <div className={`fixed top-0 left-0 w-full max-w-md h-full bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-30 flex flex-col p-6 ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex-shrink-0">
        <div className="flex items-center gap-3">
          <EarthIcon className="w-10 h-10 flex-shrink-0" />
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
              EARTH
            </h1>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 -mt-1">AI Brain Studio</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-4">
          Define the AI's personality, then review your conversation.
        </p>
        
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">System Instruction</h2>
        <textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="e.g., You are a witty pirate captain..."
          className="w-full h-32 mt-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-purple-400 focus:outline-none resize-none transition-colors"
        />
        <div className="mt-3 flex flex-col space-y-2">
          <div className="h-5 text-sm text-center font-medium">
            {getStatusMessage()}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="flex-1 flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <SaveIcon />
              Apply Brain
            </button>
            <button
              onClick={handleClear}
              className="flex-1 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200 font-bold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500"
            >
              <ClearIcon />
              Reset
            </button>
          </div>
        </div>
        <div className="border-t my-6 border-gray-200 dark:border-gray-700"></div>
      </div>

      <div className="flex-grow flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Chat History</h2>
          <button
            onClick={onNewChat}
            className="flex items-center gap-2 text-sm font-semibold py-2 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            <NewChatIcon />
            New Chat
          </button>
        </div>
        <div className="flex-grow overflow-y-auto space-y-2 pr-2 -mr-3">
          {conversations.length > 0 ? (
            conversations.map((conv) => (
              <div 
                key={conv.id}
                className={`group flex items-center justify-between p-3 rounded-lg transition-colors text-sm font-medium truncate ${
                  conv.id === activeChatId 
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                }`}
              >
                <button 
                  onClick={() => onSelectChat(conv.id)}
                  className="flex-1 text-left truncate"
                >
                  {conv.title}
                </button>
                {onDeleteChat && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                    title="Delete conversation"
                  >
                    <svg 
                      className="w-4 h-4 text-red-500 dark:text-red-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 dark:text-gray-500 pt-8">
              <p>No conversation history yet.</p>
              <p className="text-xs mt-1">Start a new chat to begin.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-shrink-0 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <ThemeToggleButton theme={theme} onToggle={onToggleTheme} />
      </div>
    </div>
  );
};

export default SidePanel;
