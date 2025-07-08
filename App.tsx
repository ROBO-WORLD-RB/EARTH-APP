
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chat } from '@google/genai';
import { Message, Conversation } from './types';
import { createChat, generateTitle } from './services/geminiService';
import ChatPanel from './components/ChatPanel';
import SidePanel from './components/SidePanel';
import PanelToggleButton from './components/PanelToggleButton';
import EarthIcon from './components/icons/EarthIcon';

const DEFAULT_INSTRUCTION = "You are a helpful and friendly AI assistant named EARTH. Provide clear and concise answers.";

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [systemInstruction, setSystemInstruction] = useState<string>('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const hideTimeoutRef = useRef<number | null>(null);
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem('earth-theme') as Theme) || 'light';
    } catch {
      return 'light';
    }
  });

  // Theme management
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('earth-theme', theme);
    } catch (e) {
      console.error("Failed to save theme preference:", e);
    }
  }, [theme]);

  const handleToggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  // Initialization from localStorage
  useEffect(() => {
    try {
      const savedInstruction = localStorage.getItem('earth-system-instruction');
      const savedConversations = localStorage.getItem('earth-conversations');
      const savedActiveChatId = localStorage.getItem('earth-active-chat-id');

      setSystemInstruction(savedInstruction || DEFAULT_INSTRUCTION);

      const parsedConversations: Conversation[] = savedConversations ? JSON.parse(savedConversations) : [];

      if (parsedConversations.length > 0) {
        setConversations(parsedConversations);
        setActiveChatId(savedActiveChatId || parsedConversations[0].id);
      } else {
        // Start with a fresh chat if no history
        const newId = Date.now().toString();
        const firstConversation: Conversation = { id: newId, title: 'New Chat', messages: [] };
        setConversations([firstConversation]);
        setActiveChatId(newId);
      }
    } catch (e) {
      console.error("Could not read from localStorage, initializing fresh state.", e);
      setSystemInstruction(DEFAULT_INSTRUCTION);
      const newId = Date.now().toString();
      const firstConversation: Conversation = { id: newId, title: 'New Chat', messages: [] };
      setConversations([firstConversation]);
      setActiveChatId(newId);
    }
    setIsInitialized(true);
  }, []);

  // Persist conversations to localStorage
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('earth-conversations', JSON.stringify(conversations));
        if (activeChatId) {
          localStorage.setItem('earth-active-chat-id', activeChatId);
        }
      } catch (e) {
        console.error("Failed to save conversations to localStorage:", e);
      }
    }
  }, [conversations, activeChatId, isInitialized]);
  
  // Create and configure the chat instance
  useEffect(() => {
    if (isInitialized && systemInstruction && activeChatId) {
      try {
        const activeConversation = conversations.find(c => c.id === activeChatId);
        const history = activeConversation ? activeConversation.messages : [];
        const newChat = createChat(systemInstruction, history);
        setChat(newChat);
      } catch (error) {
        console.error("Failed to initialize Gemini chat:", error);
        alert("Failed to initialize AI. Please check your API Key and refresh.");
      }
    }
  }, [systemInstruction, activeChatId, isInitialized, conversations]);

  const handleNewChat = useCallback(() => {
    const newId = Date.now().toString();
    const newConversation: Conversation = { id: newId, title: 'New Chat', messages: [] };
    setConversations(prev => [newConversation, ...prev]);
    setActiveChatId(newId);
    setIsPanelVisible(false); // Close panel on new chat
  }, []);

  const handleSelectChat = useCallback((id: string) => {
    if (id !== activeChatId) {
      setActiveChatId(id);
    }
    setIsPanelVisible(false); // Close panel on selection
  }, [activeChatId]);

  const handleSaveSettings = useCallback((newInstruction: string) => {
    setSaveStatus('saving');
    try {
      localStorage.setItem('earth-system-instruction', newInstruction);
      setSystemInstruction(newInstruction);
      handleNewChat(); // Start a new chat for the new "brain"
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch (e) {
      console.error("Failed to save to localStorage.");
      setSaveStatus('idle');
    }
  }, [handleNewChat]);
  
  const handleClearSettings = useCallback(() => {
    handleSaveSettings(DEFAULT_INSTRUCTION);
  }, [handleSaveSettings]);

  const updateConversationState = (updater: (prevConvs: Conversation[]) => Conversation[]) => {
    setConversations(updater);
  };

  const handleSendMessage = async (message: string) => {
    if (!chat || isLoading || !activeChatId) return;
  
    const userMessage: Message = { role: 'user', content: message };
    
    // Check if we need to generate a title
    const activeConv = conversations.find(c => c.id === activeChatId);
    const isNewChat = activeConv?.messages.length === 0;

    // Optimistically update UI with user message
    updateConversationState(prev => 
      prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, userMessage] } : c)
    );
    setIsLoading(true);

    if (isNewChat) {
      generateTitle(message).then(title => {
        updateConversationState(prev =>
          prev.map(c => c.id === activeChatId ? { ...c, title } : c)
        );
      });
    }

    try {
      const stream = await chat.sendMessageStream({ message });

      let modelResponse = '';
      let fullResponse = '';
      // Add a placeholder for the model's response
      updateConversationState(prev => 
        prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, { role: 'model', content: '' }] } : c)
      );

      for await (const chunk of stream) {
        modelResponse = chunk.text ?? '';
        fullResponse += modelResponse;

        // Stream the response into the last message
        updateConversationState(prev =>
          prev.map(c => {
            if (c.id === activeChatId) {
              const newMessages = [...c.messages];
              newMessages[newMessages.length - 1].content = fullResponse;
              return { ...c, messages: newMessages };
            }
            return c;
          })
        );
      }
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      const errorMessage: Message = { role: 'model', content: 'An error occurred. The AI brain might be overloaded. Please try again.' };
      updateConversationState(prev =>
        prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, errorMessage] } : c)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePanelMouseEnter = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setIsPanelVisible(true);
  };

  const handlePanelMouseLeave = () => {
    hideTimeoutRef.current = window.setTimeout(() => setIsPanelVisible(false), 300);
  };

  const activeMessages = conversations.find(c => c.id === activeChatId)?.messages || [];

  if (!isInitialized) {
      return (
        <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
          <div className="text-center flex flex-col items-center">
            <EarthIcon className="w-16 h-16 mb-4" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">EARTH</h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Initializing AI Brain...</p>
          </div>
        </div>
      );
  }

  return (
    <div className="h-screen w-screen font-sans bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-hidden">
      <ChatPanel
        messages={activeMessages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
      
      <div onMouseEnter={handlePanelMouseEnter} onMouseLeave={handlePanelMouseLeave}>
        {!isPanelVisible && <PanelToggleButton />}
        <SidePanel
          isVisible={isPanelVisible}
          initialInstruction={systemInstruction}
          onSave={handleSaveSettings}
          onClear={handleClearSettings}
          saveStatus={saveStatus}
          conversations={conversations}
          activeChatId={activeChatId}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
      </div>
    </div>
  );
};

export default App;
