import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, FileMessage } from '../types';
import SendIcon from './icons/SendIcon';
import BotIcon from './icons/BotIcon';
import UserIcon from './icons/UserIcon';
import EarthIcon from './icons/EarthIcon';
import FileUploadButton from './FileUploadButton';
import FilePreview from './FilePreview';
import MessageActions from './MessageActions';
import InstallIcon from './icons/InstallIcon';
import { usePWA } from '../services/pwaService';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (message: string, files?: FileMessage[]) => void;
  isLoading: boolean;
  attachedFiles?: FileMessage[];
  onFileRemove?: (fileId: string) => void;
  resetFilesTrigger?: number;
  onDeleteMessage?: (index: number) => void;
  onEditMessage?: (index: number, newContent: string) => void;
  onRegenerateResponse?: (index: number) => void;
}

interface ChatMessageProps {
  message: Message;
  index: number;
  onCopy: (content: string) => void;
  onEdit?: (index: number, content: string) => void;
  onDelete?: (index: number) => void;
  onRegenerate?: (index: number) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  index, 
  onCopy, 
  onEdit, 
  onDelete, 
  onRegenerate 
}) => {
  const isModel = message.role === 'model';
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(editContent.length, editContent.length);
    }
  }, [isEditing]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
      .then(() => {
        onCopy(message.content);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (onEdit && editContent.trim()) {
      onEdit(index, editContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className={`flex items-start gap-4 group ${isModel ? '' : 'flex-row-reverse'}`}>
      {isModel ? <BotIcon /> : <UserIcon />}
      <div className={`flex flex-col relative ${isModel ? 'items-start' : 'items-end'} flex-1`}>
        <div
          className={`max-w-2xl lg:max-w-3xl relative ${
            isModel 
              ? '' // No "box" for AI replies, for a cleaner, document-like style.
              : 'px-5 py-3 rounded-2xl shadow-sm bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-br-none'
          }`}
        >
          {isModel ? (
            isEditing ? (
              <div className="w-full">
                <textarea
                  ref={textareaRef}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full min-h-[100px] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-purple-400 focus:outline-none resize-y transition-colors"
                  placeholder="Edit message..."
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-md"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
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
            )
          ) : (
            isEditing ? (
              <div className="w-full">
                <textarea
                  ref={textareaRef}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full min-h-[100px] bg-white/20 border border-white/30 rounded-lg p-3 text-white focus:ring-2 focus:ring-white/50 focus:outline-none resize-y transition-colors"
                  placeholder="Edit message..."
                />
                <div className="flex justify-start gap-2 mt-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 text-white rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1 text-sm bg-white/30 hover:bg-white/40 text-white rounded-md"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {message.content && (
                  <p className="whitespace-pre-wrap text-[17px] mb-3">{message.content}</p>
                )}
                {message.files && message.files.length > 0 && (
                  <div className="space-y-2">
                    {message.files.map((file) => (
                      <FilePreview
                        key={file.id}
                        file={file}
                        showRemove={false}
                        className="bg-white/20 dark:bg-gray-800/20"
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          )}
          
          {!isEditing && (
            <MessageActions 
              isModel={isModel}
              onCopy={handleCopy}
              onEdit={!isModel && onEdit ? handleEdit : undefined}
              onDelete={() => onDelete && onDelete(index)}
              onRegenerate={isModel && onRegenerate ? () => onRegenerate(index) : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Welcome screen install button component
const WelcomeInstallButton: React.FC = () => {
  const { canInstall, isInstalled, showInstallPrompt } = usePWA();
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const ua = window.navigator.userAgent;
    const iOS = /iPad|iPhone|iPod/.test(ua) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(iOS);
  }, []);

  // Don't show if already installed
  if (isInstalled || (!canInstall && !isIOS)) {
    return null;
  }

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
    } else if (canInstall) {
      try {
        await showInstallPrompt();
      } catch (error) {
        console.error('Error showing install prompt:', error);
      }
    }
  };

  return (
    <>
      <button
        onClick={handleInstall}
        className="mt-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      >
        <InstallIcon className="w-5 h-5" />
        <span className="font-medium">Install EARTH AI on your device</span>
      </button>

      {/* iOS Install Instructions Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Install on iOS
              </h3>
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              To install EARTH AI on your iOS device:
            </p>
            
            <ol className="list-decimal pl-5 mb-6 text-gray-600 dark:text-gray-300 space-y-3">
              <li>
                Tap the <span className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                  Share
                </span> button in Safari
              </li>
              <li>
                Scroll down and tap <span className="font-medium">Add to Home Screen</span>
                <div className="mt-1 bg-gray-100 dark:bg-gray-700 rounded p-2 text-xs">
                  <svg className="w-6 h-6 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add to Home Screen
                </div>
              </li>
              <li>Tap <span className="font-medium">Add</span> in the top right corner</li>
            </ol>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded hover:opacity-90 transition-opacity"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ChatPanel: React.FC<ChatPanelProps> = ({ 
  messages, 
  onSendMessage, 
  isLoading, 
  attachedFiles = [],
  onFileRemove,
  resetFilesTrigger,
  onDeleteMessage,
  onEditMessage,
  onRegenerateResponse
}) => {
  const [input, setInput] = useState('');
  const [pendingFiles, setPendingFiles] = useState<FileMessage[]>([]);
  const [draftMessage, setDraftMessage] = useState<string>('');
  const [copyNotification, setCopyNotification] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load draft message from localStorage
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('earth-draft-message');
      if (savedDraft) {
        setInput(savedDraft);
        setDraftMessage(savedDraft);
      }
    } catch (e) {
      console.error("Could not load draft message from localStorage", e);
    }
  }, []);

  // Auto-save draft message
  useEffect(() => {
    try {
      if (input.trim()) {
        localStorage.setItem('earth-draft-message', input);
        setDraftMessage(input);
      } else if (draftMessage) {
        localStorage.removeItem('earth-draft-message');
        setDraftMessage('');
      }
    } catch (e) {
      console.error("Could not save draft message to localStorage", e);
    }
  }, [input, draftMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (resetFilesTrigger !== undefined) {
      setPendingFiles([]);
    }
  }, [resetFilesTrigger]);

  // Hide copy notification after 2 seconds
  useEffect(() => {
    if (copyNotification) {
      const timer = setTimeout(() => {
        setCopyNotification(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copyNotification]);

  // Hide error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleSend = () => {
    if ((input.trim() || pendingFiles.length > 0) && !isLoading) {
      try {
        onSendMessage(input.trim(), pendingFiles);
        setInput('');
        setPendingFiles([]);
        // Clear draft after successful send
        localStorage.removeItem('earth-draft-message');
        setDraftMessage('');
      } catch (error) {
        console.error("Error sending message:", error);
        setErrorMessage("Failed to send message. Please try again.");
      }
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter to send (without shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N for new chat
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        // This would require passing onNewChat as a prop
        // onNewChat();
      }
      
      // Ctrl/Cmd + / to focus input
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFileSelect = async (files: File[]) => {
    try {
      const { processFile } = await import('../utils/fileProcessor');
      const processedFiles = await Promise.all(
        files.map(file => processFile(file))
      );
      setPendingFiles(prev => [...prev, ...processedFiles]);
    } catch (error) {
      console.error('Error processing files:', error);
      setErrorMessage("Failed to process files. Please try again.");
    }
  };

  const handleFileRemove = (fileId: string) => {
    setPendingFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleCopyMessage = (content: string) => {
    setCopyNotification(true);
  };

  const handleDeleteMessage = (index: number) => {
    if (onDeleteMessage) {
      try {
        onDeleteMessage(index);
      } catch (error) {
        console.error("Error deleting message:", error);
        setErrorMessage("Failed to delete message. Please try again.");
      }
    }
  };

  const handleEditMessage = (index: number, newContent: string) => {
    if (onEditMessage) {
      try {
        onEditMessage(index, newContent);
      } catch (error) {
        console.error("Error editing message:", error);
        setErrorMessage("Failed to edit message. Please try again.");
      }
    }
  };

  const handleRegenerateResponse = (index: number) => {
    if (onRegenerateResponse) {
      try {
        onRegenerateResponse(index);
      } catch (error) {
        console.error("Error regenerating response:", error);
        setErrorMessage("Failed to regenerate response. Please try again.");
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 flex flex-col h-full w-full">
      {/* Copy notification */}
      {copyNotification && (
        <div className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out">
          Message copied to clipboard
        </div>
      )}
      
      {/* Error notification */}
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out">
          {errorMessage}
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 dark:text-gray-500 pt-20 flex flex-col items-center">
            <EarthIcon className="w-20 h-20 mb-4" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">EARTH</h1>
            <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mt-2">AI Brain Studio</h2>
            <p className="mt-4">Set the AI Brain and send a message to begin!</p>
            <p className="text-sm mt-1">Hover on the top-left button to open settings.</p>
            
            <WelcomeInstallButton />
            
            {/* Keyboard shortcuts help */}
            <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg">
              <p className="font-medium mb-2">Keyboard shortcuts:</p>
              <ul className="space-y-1">
                <li><kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded shadow">Enter</kbd> Send message</li>
                <li><kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded shadow">Shift</kbd> + <kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded shadow">Enter</kbd> New line</li>
                <li><kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded shadow">Ctrl</kbd> + <kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded shadow">/</kbd> Focus input</li>
              </ul>
            </div>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <ChatMessage 
            key={index} 
            message={msg} 
            index={index}
            onCopy={handleCopyMessage}
            onEdit={onEditMessage ? (index, content) => handleEditMessage(index, content) : undefined}
            onDelete={onDeleteMessage ? () => handleDeleteMessage(index) : undefined}
            onRegenerate={onRegenerateResponse ? () => handleRegenerateResponse(index) : undefined}
          />
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
      
      {/* File attachments preview */}
      {(pendingFiles.length > 0 || attachedFiles.length > 0) && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Attached files:
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {pendingFiles.length + attachedFiles.length} file(s)
              </span>
            </div>
            <div className="space-y-2">
              {pendingFiles.map((file) => (
                <FilePreview
                  key={file.id}
                  file={file}
                  onRemove={handleFileRemove}
                />
              ))}
              {attachedFiles.map((file) => (
                <FilePreview
                  key={file.id}
                  file={file}
                  onRemove={onFileRemove}
                  showRemove={false}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
        <div className="relative max-w-4xl mx-auto flex items-end gap-2">
          <FileUploadButton
            onFileSelect={handleFileSelect}
            disabled={isLoading}
            className="flex-shrink-0"
          />
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Talk to your custom AI... (Ctrl+/ to focus)"
              rows={1}
              className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full py-3 pl-5 pr-16 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:outline-none resize-none transition-all duration-200"
              disabled={isLoading}
              style={{paddingTop: '0.8rem', paddingBottom: '0.8rem'}}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && pendingFiles.length === 0)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all"
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </div>
        </div>
        
        {/* Draft indicator */}
        {draftMessage && !isLoading && (
          <div className="max-w-4xl mx-auto mt-1 text-xs text-gray-500 dark:text-gray-400 pl-12">
            Draft saved automatically
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;