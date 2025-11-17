import React from 'react';

interface LearningPlanProps {
  plan: string;
  onStartLearning: () => void;
  isLoading: boolean;
}

const LearningPlan: React.FC<LearningPlanProps> = ({ plan, onStartLearning, isLoading }) => {
  const formatMarkdown = (text: string) => {
    if (!text) return '';
    // This parser handles headers, bold text, and newlines.
    return text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-cyan-300 mt-4 mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh] transform transition-all duration-300 ease-out scale-95 animate-scale-in">
        <h2 className="p-8 pb-4 text-2xl font-bold text-cyan-400 flex-shrink-0">
          Rencana Belajar Pribadi Anda
        </h2>
        
        <div className="px-8 flex-grow overflow-y-auto">
          {isLoading ? (
              <div className="flex flex-col items-center justify-center h-40">
                  <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-cyan-500"></div>
              </div>
          ) : (
               <div 
                 className="prose prose-invert text-gray-300 max-w-none [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>strong]:text-cyan-300" 
                 dangerouslySetInnerHTML={{ __html: formatMarkdown(plan) }} 
              />
          )}
        </div>

        <div className="p-8 pt-4 text-right flex-shrink-0">
          <button
            onClick={onStartLearning}
            disabled={isLoading}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-500 transition-colors shadow-lg"
          >
            Mulai Belajar
          </button>
        </div>
      </div>
       <style>{`
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LearningPlan;