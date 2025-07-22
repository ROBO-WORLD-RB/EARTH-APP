import React, { useState, useMemo } from 'react';
import { personalityTemplates, personalityCategories, getTemplatesByCategory, searchTemplates, PersonalityTemplate } from '../data/personalityTemplates';
import ModalPortal from './ModalPortal';
import ModalWrapper from './ModalWrapper';

interface PersonalityTemplatesProps {
  onSelect: (instruction: string, name: string) => void;
  onCancel: () => void;
}

const PersonalityTemplates: React.FC<PersonalityTemplatesProps> = ({ onSelect, onCancel }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<PersonalityTemplate | null>(null);

  const filteredTemplates = useMemo(() => {
    let templates = personalityTemplates;
    
    if (searchQuery) {
      templates = searchTemplates(searchQuery);
    } else if (selectedCategory !== 'all') {
      templates = getTemplatesByCategory(selectedCategory);
    }
    
    return templates;
  }, [selectedCategory, searchQuery]);

  const handleTemplateSelect = (template: PersonalityTemplate) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate.systemInstruction, selectedTemplate.name);
    }
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
                AI Personalities
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

          {/* Categories */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Categories</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                All Categories
              </button>
              {personalityCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center ${
                    selectedCategory === category.id
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Templates List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400'
                  }`}
                >
                  <div className="flex items-start">
                    <span className="text-2xl mr-3 flex-shrink-0">{template.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {template.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {template.description}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {selectedTemplate ? (
            <>
              {/* Template Details */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex items-start mb-6">
                  <span className="text-4xl mr-4 flex-shrink-0">{selectedTemplate.icon}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {selectedTemplate.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {selectedTemplate.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    System Instructions Preview
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border">
                    <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                      {selectedTemplate.systemInstruction}
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
                    onClick={handleUseTemplate}
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
                <p className="text-lg mb-2">Select a personality template</p>
                <p className="text-sm">Choose from the list to see details and preview</p>
              </div>
            </div>
          )}
        </div>
      </ModalWrapper>
    </ModalPortal>
  );
};

export default PersonalityTemplates;