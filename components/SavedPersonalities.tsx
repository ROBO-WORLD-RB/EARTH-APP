import React, { useState } from 'react';
import { usePersonalities, SavedPersonality } from '../services/personalityService';
import ModalPortal from './ModalPortal';
import ModalWrapper from './ModalWrapper';

interface SavedPersonalitiesProps {
  onSelect: (instruction: string, name: string) => void;
  onCancel: () => void;
}

const SavedPersonalities: React.FC<SavedPersonalitiesProps> = ({ onSelect, onCancel }) => {
  const { 
    savedPersonalities, 
    recentPersonalities, 
    favoritePersonalities,
    deletePersonality,
    toggleFavorite,
    usePersonality
  } = usePersonalities();
  
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'recent'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPersonality, setSelectedPersonality] = useState<SavedPersonality | null>(null);
  
  // Filter personalities based on search query
  const filteredPersonalities = () => {
    let personalities: SavedPersonality[] = [];
    
    switch (activeTab) {
      case 'favorites':
        personalities = favoritePersonalities;
        break;
      case 'recent':
        personalities = recentPersonalities;
        break;
      default:
        personalities = savedPersonalities;
    }
    
    if (!searchQuery) {
      return personalities;
    }
    
    const query = searchQuery.toLowerCase();
    return personalities.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.instruction.toLowerCase().includes(query) ||
      (p.category && p.category.toLowerCase().includes(query))
    );
  };
  
  const handleUsePersonality = () => {
    if (selectedPersonality) {
      usePersonality(selectedPersonality.id);
      onSelect(selectedPersonality.instruction, selectedPersonality.name);
    }
  };
  
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this personality?')) {
      deletePersonality(id);
      if (selectedPersonality?.id === id) {
        setSelectedPersonality(null);
      }
    }
  };
  
  const handleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(id);
  };
  
  return (
    <ModalPortal>
      <ModalWrapper onClose={onCancel} maxWidth="6xl">
        <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Saved Personalities
              </h2>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search personalities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === 'all'
                  ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === 'favorites'
                  ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Favorites
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === 'recent'
                  ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Recent
            </button>
          </div>

          {/* Personalities List */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredPersonalities().length > 0 ? (
              <div className="space-y-2">
                {filteredPersonalities().map((personality) => (
                  <div
                    key={personality.id}
                    onClick={() => setSelectedPersonality(personality)}
                    className={`relative w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedPersonality?.id === personality.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400'
                    }`}
                  >
                    <div className="flex items-start">
                      <span className="text-2xl mr-3 flex-shrink-0">
                        {personality.icon || '🧠'}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate pr-16">
                          {personality.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {personality.instruction.substring(0, 100)}...
                        </div>
                        {personality.category && (
                          <span className="inline-block px-2 py-1 mt-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                            {personality.category}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="absolute top-3 right-3 flex space-x-1">
                      <button
                        onClick={(e) => handleFavorite(personality.id, e)}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        title={personality.favorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        {personality.favorite ? (
                          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={(e) => handleDelete(personality.id, e)}
                        className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                        title="Delete personality"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {activeTab === 'all' ? (
                  <p>No saved personalities yet.</p>
                ) : activeTab === 'favorites' ? (
                  <p>No favorite personalities yet.</p>
                ) : (
                  <p>No recently used personalities.</p>
                )}
                <p className="text-sm mt-1">Create and save personalities to see them here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {selectedPersonality ? (
            <>
              {/* Personality Details */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex items-start mb-6">
                  <span className="text-4xl mr-4 flex-shrink-0">
                    {selectedPersonality.icon || '🧠'}
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {selectedPersonality.name}
                    </h3>
                    {selectedPersonality.category && (
                      <span className="inline-block px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full mb-4">
                        {selectedPersonality.category}
                      </span>
                    )}
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(selectedPersonality.createdAt).toLocaleDateString()} 
                      {selectedPersonality.lastUsed && (
                        <span> · Last used: {new Date(selectedPersonality.lastUsed).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    System Instructions
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border">
                    <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                      {selectedPersonality.instruction}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUsePersonality}
                    className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Use This Personality
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg mb-2">Select a personality</p>
                <p className="text-sm">Choose from the list to see details and apply</p>
              </div>
            </div>
          )}
        </div>
      </ModalWrapper>
    </ModalPortal>
  );
};

export default SavedPersonalities;