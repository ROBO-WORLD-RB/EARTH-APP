import React, { useState } from 'react';
import ModalPortal from './ModalPortal';
import ModalWrapper from './ModalWrapper';

interface InstructionHelpProps {
  onClose: () => void;
}

const InstructionHelp: React.FC<InstructionHelpProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'examples' | 'tips'>('basics');

  return (
    <ModalPortal>
      <ModalWrapper onClose={onClose} maxWidth="4xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            How to Write Effective AI Instructions
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'basics'
                ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('basics')}
          >
            Basics
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'examples'
                ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('examples')}
          >
            Examples
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'tips'
                ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('tips')}
          >
            Advanced Tips
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basics' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  What are System Instructions?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  System instructions define how the AI should behave, what role it should play, and what tone it should use. 
                  Think of it as setting the AI's personality and expertise before you start chatting.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Basic Structure
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
{`You are a [role] who [key characteristics].

Your goal is to [main objective].

When responding, you should:
- [behavior 1]
- [behavior 2]
- [behavior 3]

Tone: [formal/casual/friendly/etc.]`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Key Components
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                  <li><strong>Role Definition:</strong> Define who the AI is (teacher, coach, expert, etc.)</li>
                  <li><strong>Expertise:</strong> Specify areas of knowledge or specialization</li>
                  <li><strong>Goals:</strong> What the AI should help achieve</li>
                  <li><strong>Behaviors:</strong> How the AI should respond and interact</li>
                  <li><strong>Tone:</strong> The communication style (formal, friendly, enthusiastic)</li>
                  <li><strong>Constraints:</strong> Any limitations or boundaries</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Example 1: Programming Tutor
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
{`You are a patient programming tutor with expertise in multiple programming languages. Your goal is to help students understand coding concepts and improve their skills.

When responding to questions:
- Explain concepts clearly with simple examples
- Provide code snippets that demonstrate the concept
- Point out common mistakes and how to avoid them
- Encourage good coding practices and patterns

If a student is struggling, break down complex topics into smaller, manageable parts. Always be encouraging and focus on progress rather than perfection.`}
                  </pre>
                </div>
                <button 
                  className="mt-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
                  onClick={() => {
                    navigator.clipboard.writeText(`You are a patient programming tutor with expertise in multiple programming languages. Your goal is to help students understand coding concepts and improve their skills.

When responding to questions:
- Explain concepts clearly with simple examples
- Provide code snippets that demonstrate the concept
- Point out common mistakes and how to avoid them
- Encourage good coding practices and patterns

If a student is struggling, break down complex topics into smaller, manageable parts. Always be encouraging and focus on progress rather than perfection.`);
                  }}
                >
                  Copy to clipboard
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Example 2: Creative Writing Coach
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
{`You are a creative writing coach with a background in fiction and storytelling. Your goal is to help writers develop their craft and overcome creative blocks.

When responding:
- Provide constructive feedback that balances positives with areas for improvement
- Suggest specific techniques to enhance character development, plot, dialogue, or description
- Offer creative prompts and exercises when someone is stuck
- Reference relevant examples from literature when helpful

Your tone should be encouraging and supportive, but also honest. Focus on helping writers find their unique voice rather than imposing a particular style.`}
                  </pre>
                </div>
                <button 
                  className="mt-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
                  onClick={() => {
                    navigator.clipboard.writeText(`You are a creative writing coach with a background in fiction and storytelling. Your goal is to help writers develop their craft and overcome creative blocks.

When responding:
- Provide constructive feedback that balances positives with areas for improvement
- Suggest specific techniques to enhance character development, plot, dialogue, or description
- Offer creative prompts and exercises when someone is stuck
- Reference relevant examples from literature when helpful

Your tone should be encouraging and supportive, but also honest. Focus on helping writers find their unique voice rather than imposing a particular style.`);
                  }}
                >
                  Copy to clipboard
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Example 3: Fitness Coach
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
{`You are a motivational fitness coach with expertise in exercise science and nutrition. Your goal is to help people achieve their fitness goals safely and effectively.

When providing advice:
- Prioritize safety and proper form
- Explain the reasoning behind recommendations
- Offer modifications for different fitness levels
- Be encouraging but realistic about timeframes and results

Your tone should be energetic and motivating without being pushy. Focus on sustainable habits and long-term health rather than quick fixes or extreme approaches.`}
                  </pre>
                </div>
                <button 
                  className="mt-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
                  onClick={() => {
                    navigator.clipboard.writeText(`You are a motivational fitness coach with expertise in exercise science and nutrition. Your goal is to help people achieve their fitness goals safely and effectively.

When providing advice:
- Prioritize safety and proper form
- Explain the reasoning behind recommendations
- Offer modifications for different fitness levels
- Be encouraging but realistic about timeframes and results

Your tone should be energetic and motivating without being pushy. Focus on sustainable habits and long-term health rather than quick fixes or extreme approaches.`);
                  }}
                >
                  Copy to clipboard
                </button>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Be Specific About Expertise
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Instead of saying "You are knowledgeable about science," try "You are a physicist with expertise in quantum mechanics and a background in explaining complex concepts to non-specialists."
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Define Response Format
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You can specify how you want information structured:
                </p>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mt-2">
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
{`When analyzing problems, structure your response as follows:
1. Problem summary (1-2 sentences)
2. Root causes (bullet points)
3. Potential solutions (numbered list)
4. Recommended approach (1 paragraph)
5. Next steps (bullet points)`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Use Constraints Effectively
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Setting boundaries can improve responses:
                </p>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mt-2">
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
{`Keep explanations under 3 paragraphs.
Avoid using technical jargon without explanation.
When giving examples, use real-world scenarios rather than abstract cases.`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Specify Reasoning Process
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Guide how the AI should think through problems:
                </p>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mt-2">
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
{`When analyzing business decisions:
1. First consider the short-term financial impact
2. Then evaluate long-term strategic implications
3. Finally, assess potential risks and mitigation strategies
Always consider multiple perspectives before making recommendations.`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Combine Multiple Personas
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Create richer interactions by combining different expertise:
                </p>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mt-2">
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
{`You have the technical knowledge of a senior software engineer, the communication skills of a technical writer, and the user empathy of a UX designer. Use these perspectives to provide comprehensive advice on software development challenges.`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Pro tip: Use templates or the personality builder for quick setup
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded hover:opacity-90 transition-opacity"
          >
            Got it
          </button>
        </div>
      </ModalWrapper>
    </ModalPortal>
  );
};

export default InstructionHelp;