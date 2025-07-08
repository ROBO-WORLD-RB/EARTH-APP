
import React, { useState, useEffect } from 'react';
import SaveIcon from './icons/SaveIcon';
import ClearIcon from './icons/ClearIcon';

interface SettingsPanelProps {
  initialInstruction: string;
  onSave: (instruction: string) => void;
  onClear: () => void;
  saveStatus: 'idle' | 'saving' | 'saved';
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ initialInstruction, onSave, onClear, saveStatus }) => {
  const [instruction, setInstruction] = useState(initialInstruction);

  useEffect(() => {
    setInstruction(initialInstruction);
  }, [initialInstruction]);

  const handleSave = () => {
    onSave(instruction);
  };

  const handleClear = () => {
    setInstruction('');
    onClear();
  };
  
  const getStatusMessage = () => {
    switch (saveStatus) {
      case 'saving':
        return <span className="text-yellow-400">Applying...</span>;
      case 'saved':
        return <span className="text-green-400">Brain settings applied!</span>;
      default:
        return <span className="text-gray-400">Define the AI's core behavior.</span>;
    }
  };

  return (
    <div className="bg-gray-800 text-white w-full h-full p-6 flex flex-col border-r border-gray-700">
      <h1 className="text-2xl font-bold text-indigo-400">
        EARTH
      </h1>
      <h2 className="text-lg font-semibold mt-4 mb-2 text-gray-200">AI Brain Settings</h2>
      <p className="text-sm text-gray-400 mb-4">
        Write the AI's personality, rules, and constraints below. This system instruction will guide all its responses.
      </p>
      <textarea
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        placeholder="e.g., You are a witty pirate captain who speaks in sea shanties. You are obsessed with finding treasure and always end your sentences with 'Yarrr!'"
        className="w-full flex-grow bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none transition-colors"
      />
      <div className="mt-4 flex flex-col space-y-3">
        <div className="h-6 text-sm text-center">
          {getStatusMessage()}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="flex-1 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
          >
            <SaveIcon />
            Apply Brain
          </button>
          <button
            onClick={handleClear}
            className="flex-1 flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500"
          >
            <ClearIcon />
            Reset Brain
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
