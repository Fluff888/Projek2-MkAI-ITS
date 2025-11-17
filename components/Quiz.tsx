import React, { useState } from 'react';
import type { QuizQuestion } from '../types';

interface QuizProps {
  title: string;
  questions: QuizQuestion[];
  onSubmit: (score: number, answers: { question: QuizQuestion; answer: string }[]) => void;
  isLoading: boolean;
  totalQuestions: number;
}

const Quiz: React.FC<QuizProps> = ({ title, questions, onSubmit, isLoading, totalQuestions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ question: QuizQuestion; answer: string }[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-500"></div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = () => {
    if (!selectedAnswer) return;

    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    const newAnswers = [...userAnswers, { question: currentQuestion, answer: selectedAnswer }];

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setUserAnswers(newAnswers);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        const score = newAnswers.filter(a => a.answer === a.question.correctAnswer).length;
        onSubmit(score, newAnswers);
      }
    }, 1200); // Wait a bit to show feedback
  };

  const getButtonClass = (option: string) => {
    if (showFeedback) {
      if (option === currentQuestion.correctAnswer) return 'bg-green-500/80 ring-2 ring-green-400';
      if (option === selectedAnswer) return 'bg-red-500/80 ring-2 ring-red-400';
      return 'bg-gray-700/50 cursor-not-allowed';
    }
    if (option === selectedAnswer) return 'bg-blue-600 ring-2 ring-blue-400';
    return 'bg-gray-700 hover:bg-gray-600';
  };

  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-2xl p-8 space-y-8 bg-gray-800 rounded-2xl shadow-2xl">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-cyan-400">{title}</h1>
            <p className="mt-2 text-gray-400">Pertanyaan {currentQuestionIndex + 1} dari {totalQuestions}</p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${progressPercentage}%`, transition: 'width 0.5s ease-in-out' }}></div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">{currentQuestion?.question}</h2>
          <div className="space-y-4">
            {currentQuestion?.options.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedAnswer(option)}
                disabled={showFeedback}
                className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${getButtonClass(option)}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="text-right">
          <button
            onClick={handleNext}
            disabled={!selectedAnswer || showFeedback}
            className="px-8 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Pertanyaan Berikutnya' : 'Selesaikan Kuis'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;