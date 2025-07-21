
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chat } from '@google/genai';
import { User } from 'firebase/auth';
import { Message, Conversation, FileMessage } from './types';
import { createChat, generateTitle } from './services/geminiService';
import { fileStorage } from './services/fileStorage';
import { onAuthStateChange } from './services/authService';
import ChatPanel from './components/ChatPanel';
import SidePanel from './components/SidePanel';
import PanelToggleButton from './components/PanelToggleButton';
import EarthIcon from './components/icons/EarthIcon';
import AuthPage from './components/AuthPage';
import UserProfile from './components/UserProfile';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import PWAUpdateNotification from './components/PWAUpdateNotification';
import PWAStatus from './components/PWAStatus';

const DEFAULT_INSTRUCTION = "You are a helpful and friendly AI assistant named EARTH. Provide clear and concise answers.";

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [systemInstruction, setSystemInstruction] = useState<string>('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<FileMessage[]>([]);
  const hideTimeoutRef = useRef<number | null>(null);
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem('earth-theme') as Theme) || 'light';
    } catch {
      return 'light';
    }
  });
  const [resetFilesTrigger, setResetFilesTrigger] = useState(0);
  
  // Auth state listener
  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log('Auth loading timeout reached, setting authLoading to false');
      setAuthLoading(false);
    }, 10000); // 10 second timeout
    
    try {
      const unsubscribe = onAuthStateChange((currentUser) => {
        console.log('Auth state changed:', currentUser ? 'User logged in' : 'No user');
        clearTimeout(timeout);
        setUser(currentUser);
        setAuthLoading(false);
      });
      
      return () => {
        clearTimeout(timeout);
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up auth state listener:', error);
      clearTimeout(timeout);
      setAuthLoading(false);
    }
  }, []);

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
    if (!user) return;
    
    try {
      // Use user ID in storage keys for user-specific data
      const userPrefix = `earth-${user.uid}-`;
      const savedInstruction = localStorage.getItem(`${userPrefix}system-instruction`);
      const savedConversations = localStorage.getItem(`${userPrefix}conversations`);
      const savedActiveChatId = localStorage.getItem(`${userPrefix}active-chat-id`);

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
  }, [user]);

  // Persist conversations to localStorage
  useEffect(() => {
    if (isInitialized && user) {
      try {
        const userPrefix = `earth-${user.uid}-`;
        localStorage.setItem(`${userPrefix}conversations`, JSON.stringify(conversations));
        if (activeChatId) {
          localStorage.setItem(`${userPrefix}active-chat-id`, activeChatId);
        }
      } catch (e) {
        console.error("Failed to save conversations to localStorage:", e);
      }
    }
  }, [conversations, activeChatId, isInitialized, user]);
  
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
    setAttachedFiles([]); // Clear attached files for new chat
    setIsPanelVisible(false); // Close panel on new chat
  }, []);

  const handleSelectChat = useCallback(async (id: string) => {
    if (id !== activeChatId) {
      setActiveChatId(id);
      // Load files for the selected conversation
      try {
        const files = await fileStorage.getFilesByConversation(id);
        setAttachedFiles(files);
      } catch (error) {
        console.error('Error loading conversation files:', error);
        setAttachedFiles([]);
      }
    }
    setIsPanelVisible(false); // Close panel on selection
  }, [activeChatId]);

  const handleDeleteChat = useCallback(async (id: string) => {
    try {
      // Delete associated files first
      await fileStorage.deleteFilesByConversation(id);
      
      // Remove conversation from state
      setConversations(prev => prev.filter(c => c.id !== id));
      
      // If this was the active chat, switch to the first available chat or create a new one
      if (id === activeChatId) {
        const remainingConversations = conversations.filter(c => c.id !== id);
        if (remainingConversations.length > 0) {
          setActiveChatId(remainingConversations[0].id);
          const files = await fileStorage.getFilesByConversation(remainingConversations[0].id);
          setAttachedFiles(files);
        } else {
          handleNewChat();
        }
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  }, [activeChatId, conversations, handleNewChat]);

  const handleSaveSettings = useCallback((newInstruction: string) => {
    setSaveStatus('saving');
    try {
      if (user) {
        const userPrefix = `earth-${user.uid}-`;
        localStorage.setItem(`${userPrefix}system-instruction`, newInstruction);
        setSystemInstruction(newInstruction);
        handleNewChat(); // Start a new chat for the new "brain"
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2500);
      }
    } catch (e) {
      console.error("Failed to save to localStorage.");
      setSaveStatus('idle');
    }
  }, [handleNewChat, user]);
  
  const handleClearSettings = useCallback(() => {
    handleSaveSettings(DEFAULT_INSTRUCTION);
  }, [handleSaveSettings]);

  const updateConversationState = (updater: (prevConvs: Conversation[]) => Conversation[]) => {
    setConversations(updater);
  };

  const handleSendMessage = async (message: string, files?: FileMessage[]) => {
    if (!chat || isLoading || !activeChatId) return;
  
    const userMessage: Message = { 
      role: 'user', 
      content: message,
      files: files || []
    };
    
    // Save files to storage if provided
    if (files && files.length > 0) {
      try {
        await Promise.all(
          files.map(file => fileStorage.saveFile({ ...file, conversationId: activeChatId }))
        );
        setAttachedFiles(prev => [...prev, ...files]);
      } catch (error) {
        console.error('Error saving files:', error);
        // Continue with the message even if file saving fails
      }
    }
    
    // Check if we need to generate a title
    const activeConv = conversations.find(c => c.id === activeChatId);
    const isNewChat = activeConv?.messages.length === 0;

    // Optimistically update UI with user message
    updateConversationState(prev => 
      prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, userMessage] } : c)
    );
    setIsLoading(true);

    if (isNewChat) {
      generateTitle(message, files).then(title => {
        updateConversationState(prev =>
          prev.map(c => c.id === activeChatId ? { ...c, title } : c)
        );
      });
    }

    try {
      // For now, we'll include file content in the text message
      // In a full implementation, you'd use the proper Gemini API for files
      let fullMessage = message;
      
      if (files && files.length > 0) {
        files.forEach(file => {
          if (file.type.startsWith('image/')) {
            fullMessage += `\n[Image: ${file.name}]`;
          } else {
            fullMessage += `\n[File: ${file.name}]\n${file.content}\n`;
          }
        });
      }

      const stream = await chat.sendMessageStream({ message: fullMessage });

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
      setResetFilesTrigger(t => t + 1);
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

  // Loading state - only show loading when actually loading auth or initializing for authenticated users
  if (authLoading || (user && !isInitialized)) {
    console.log('Loading state:', { authLoading, user: !!user, isInitialized });
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <div className="text-center flex flex-col items-center">
          <EarthIcon className="w-16 h-16 mb-4" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">EARTH</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            {authLoading ? "Checking authentication..." : "Initializing AI Brain..."}
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <AuthPage />;
  }

  // Handle message deletion
  const handleDeleteMessage = (index: number) => {
    if (!activeChatId) return;
    
    updateConversationState(prev =>
      prev.map(c => {
        if (c.id === activeChatId) {
          const newMessages = [...c.messages];
          newMessages.splice(index, 1);
          return { ...c, messages: newMessages };
        }
        return c;
      })
    );
  };

  // Handle message editing
  const handleEditMessage = (index: number, newContent: string) => {
    if (!activeChatId) return;
    
    updateConversationState(prev =>
      prev.map(c => {
        if (c.id === activeChatId) {
          const newMessages = [...c.messages];
          newMessages[index] = { ...newMessages[index], content: newContent };
          return { ...c, messages: newMessages };
        }
        return c;
      })
    );
  };

  // Handle response regeneration
  const handleRegenerateResponse = async (index: number) => {
    if (!chat || !activeChatId || isLoading) return;
    
    // Find the previous user message
    const activeConversation = conversations.find(c => c.id === activeChatId);
    if (!activeConversation) return;
    
    // We need to find the last user message before this model message
    let userMessageIndex = -1;
    for (let i = index - 1; i >= 0; i--) {
      if (activeConversation.messages[i].role === 'user') {
        userMessageIndex = i;
        break;
      }
    }
    
    if (userMessageIndex === -1) return;
    
    const userMessage = activeConversation.messages[userMessageIndex];
    
    // Remove the current model response
    updateConversationState(prev =>
      prev.map(c => {
        if (c.id === activeChatId) {
          const newMessages = [...c.messages];
          newMessages[index] = { ...newMessages[index], content: 'Regenerating response...' };
          return { ...c, messages: newMessages };
        }
        return c;
      })
    );
    
    setIsLoading(true);
    
    try {
      // For now, we'll include file content in the text message
      let fullMessage = userMessage.content;
      
      if (userMessage.files && userMessage.files.length > 0) {
        userMessage.files.forEach(file => {
          if (file.type.startsWith('image/')) {
            fullMessage += `\n[Image: ${file.name}]`;
          } else {
            fullMessage += `\n[File: ${file.name}]\n${file.content}\n`;
          }
        });
      }

      const stream = await chat.sendMessageStream({ message: fullMessage });

      let modelResponse = '';
      let fullResponse = '';

      for await (const chunk of stream) {
        modelResponse = chunk.text ?? '';
        fullResponse += modelResponse;

        // Stream the regenerated response into the message
        updateConversationState(prev =>
          prev.map(c => {
            if (c.id === activeChatId) {
              const newMessages = [...c.messages];
              newMessages[index].content = fullResponse;
              return { ...c, messages: newMessages };
            }
            return c;
          })
        );
      }
    } catch (error) {
      console.error("Error regenerating response:", error);
      updateConversationState(prev =>
        prev.map(c => {
          if (c.id === activeChatId) {
            const newMessages = [...c.messages];
            newMessages[index].content = 'Failed to regenerate response. Please try again.';
            return { ...c, messages: newMessages };
          }
          return c;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen font-sans bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-hidden">
      {/* PWA Components */}
      <PWAInstallPrompt />
      <PWAUpdateNotification />
      <PWAStatus />
      
      <div className="absolute top-4 right-4 z-40">
        <UserProfile user={user!} />
      </div>
      
      <ChatPanel
        messages={activeMessages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        attachedFiles={attachedFiles}
        onFileRemove={async (fileId: string) => {
          try {
            await fileStorage.deleteFile(fileId);
            setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
          } catch (error) {
            console.error('Error removing file:', error);
          }
        }}
        resetFilesTrigger={resetFilesTrigger}
        onDeleteMessage={handleDeleteMessage}
        onEditMessage={handleEditMessage}
        onRegenerateResponse={handleRegenerateResponse}
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
          onDeleteChat={handleDeleteChat}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
      </div>
    </div>
  );
};

export default App;
