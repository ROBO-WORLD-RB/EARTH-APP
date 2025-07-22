import React, { useState } from 'react';
import ModalPortal from './ModalPortal';
import ModalWrapper from './ModalWrapper';

interface PersonalityBuilderProps {
  onComplete: (instruction: string) => void;
  onCancel: () => void;
}

interface BuilderStep {
  id: string;
  title: string;
  question: string;
  options: { value: string; label: string; description?: string }[];
}

const builderSteps: BuilderStep[] = [
  {
    id: 'role',
    title: 'AI Role',
    question: 'What role should the AI play?',
    options: [
      { value: 'assistant', label: 'Assistant', description: 'Helpful general-purpose assistant' },
      { value: 'expert', label: 'Expert', description: 'Subject matter expert in specific fields' },
      { value: 'teacher', label: 'Teacher', description: 'Educational and instructional' },
      { value: 'coach', label: 'Coach', description: 'Motivational and supportive' },
      { value: 'analyst', label: 'Analyst', description: 'Data-driven and analytical' },
      { value: 'creative', label: 'Creative Partner', description: 'Imaginative and artistic' }
    ]
  },
  {
    id: 'tone',
    title: 'Communication Style',
    question: 'What tone should the AI use?',
    options: [
      { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
      { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
      { value: 'casual', label: 'Casual', description: 'Relaxed and conversational' },
      { value: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic and motivating' },
      { value: 'scholarly', label: 'Scholarly', description: 'Academic and detailed' },
      { value: 'witty', label: 'Witty', description: 'Clever and humorous' }
    ]
  },
  {
    id: 'expertise',
    title: 'Area of Focus',
    question: 'What should the AI specialize in?',
    options: [
      { value: 'general', label: 'General Knowledge', description: 'Broad range of topics' },
      { value: 'technology', label: 'Technology', description: 'Programming, tech trends, digital tools' },
      { value: 'business', label: 'Business', description: 'Strategy, management, entrepreneurship' },
      { value: 'creative', label: 'Creative Arts', description: 'Writing, design, music, art' },
      { value: 'education', label: 'Education', description: 'Learning, teaching, academic subjects' },
      { value: 'health', label: 'Health & Wellness', description: 'Fitness, nutrition, mental health' },
      { value: 'science', label: 'Science', description: 'Research, analysis, scientific method' }
    ]
  },
  {
    id: 'detail',
    title: 'Response Style',
    question: 'How detailed should responses be?',
    options: [
      { value: 'brief', label: 'Brief & Concise', description: 'Short, to-the-point answers' },
      { value: 'balanced', label: 'Balanced', description: 'Moderate detail with examples' },
      { value: 'comprehensive', label: 'Comprehensive', description: 'Thorough explanations with context' },
      { value: 'step-by-step', label: 'Step-by-Step', description: 'Detailed instructions and processes' }
    ]
  }
];

const PersonalityBuilder: React.FC<PersonalityBuilderProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});

  const handleSelection = (stepId: string, value: string) => {
    setSelections(prev => ({ ...prev, [stepId]: value }));
  };

  const handleNext = () => {
    if (currentStep < builderSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateInstruction();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateInstruction = () => {
    const { role, tone, expertise, detail } = selections;
    
    let instruction = `You are a ${role} with a ${tone} communication style.`;
    
    // Add expertise context
    if (expertise !== 'general') {
      instruction += ` You specialize in ${expertise} and have deep knowledge in this area.`;
    }
    
    // Add role-specific behaviors
    switch (role) {
      case 'assistant':
        instruction += ' Your goal is to be helpful, accurate, and efficient in assisting users with their tasks and questions.';
        break;
      case 'expert':
        instruction += ' You provide authoritative, well-researched answers and share insights from your expertise.';
        break;
      case 'teacher':
        instruction += ' You explain concepts clearly, provide examples, and help users learn and understand new topics.';
        break;
      case 'coach':
        instruction += ' You motivate, encourage, and guide users toward achieving their goals.';
        break;
      case 'analyst':
        instruction += ' You approach problems systematically, analyze data, and provide evidence-based recommendations.';
        break;
      case 'creative':
        instruction += ' You inspire creativity, suggest innovative ideas, and help with creative problem-solving.';
        break;
    }
    
    // Add tone-specific instructions
    switch (tone) {
      case 'professional':
        instruction += ' Maintain a professional demeanor, use formal language, and focus on efficiency and accuracy.';
        break;
      case 'friendly':
        instruction += ' Be warm, approachable, and personable in your interactions.';
        break;
      case 'casual':
        instruction += ' Use conversational language and maintain a relaxed, informal tone.';
        break;
      case 'enthusiastic':
        instruction += ' Show excitement and energy in your responses, and motivate users with your positive attitude.';
        break;
      case 'scholarly':
        instruction += ' Use precise language, cite relevant information, and provide thorough, academic-style explanations.';
        break;
      case 'witty':
        instruction += ' Include appropriate humor, clever observations, and light-hearted commentary when suitable.';
        break;
    }
    
    // Add detail level instructions
    switch (detail) {
      case 'brief':
        instruction += ' Keep responses concise and focused on the essential information.';
        break;
      case 'balanced':
        instruction += ' Provide clear explanations with relevant examples and context.';
        break;
      case 'comprehensive':
        instruction += ' Give thorough, detailed responses that cover all relevant aspects of the topic.';
        break;
      case 'step-by-step':
        instruction += ' Break down complex topics into clear, sequential steps with detailed instructions.';
        break;
    }
    
    onComplete(instruction);
  };

  const currentStepData = builderSteps[currentStep];
  const isLastStep = currentStep === builderSteps.length - 1;
  const canProceed = selections[currentStepData.id];

  return (
    <ModalPortal>
      <ModalWrapper onClose={onCancel} maxWidth="2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                AI Personality Builder
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Step {currentStep + 1} of {builderSteps.length}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span>{currentStepData.title}</span>
              <span>{Math.round(((currentStep + 1) / builderSteps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / builderSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {currentStepData.question}
            </h3>
            
            <div className="space-y-3">
              {currentStepData.options.map((option) => (
                <label
                  key={option.value}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selections[currentStepData.id] === option.value
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400'
                  }`}
                >
                  <input
                    type="radio"
                    name={currentStepData.id}
                    value={option.value}
                    checked={selections[currentStepData.id] === option.value}
                    onChange={() => handleSelection(currentStepData.id, option.value)}
                    className="sr-only"
                  />
                  <div className="flex items-start">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 mt-0.5 flex-shrink-0 ${
                      selections[currentStepData.id] === option.value
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300 dark:border-gray-500'
                    }`}>
                      {selections[currentStepData.id] === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isLastStep ? 'Create AI Personality' : 'Next'}
            </button>
          </div>
        </div>
      </ModalWrapper>
    </ModalPortal>
  );
};

export default PersonalityBuilder;