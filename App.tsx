import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Chat } from "@google/genai";
import PeriodicTable from './components/PeriodicTable';
import ChatWindow from './components/ChatWindow';
import ElementDetail from './components/ElementDetail';
import Quiz from './components/Quiz';
import LearningPlan from './components/LearningPlan';
import Results from './components/Results';
import { createTutorChatSession, generateQuiz, analyzeTestResults } from './services/geminiService';
import type { ElementData, ChatMessage, QuizQuestion } from './types';

type AppState = 'PRE_TEST' | 'LEARNING' | 'POST_TEST' | 'RESULTS';

const TOTAL_QUESTIONS = 5;

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('PRE_TEST');
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isQuizLoading, setIsQuizLoading] = useState(true);
  const [learningPlan, setLearningPlan] = useState<string | null>(null);
  const [showLearningPlan, setShowLearningPlan] = useState(false);
  const [preTestScore, setPreTestScore] = useState(0);
  const [postTestScore, setPostTestScore] = useState(0);

  const initialMessages = useMemo(() => [
    {
      sender: 'tutor' as const,
      text: "Halo! Saya Profesor Elemento. Saya bisa mengajari Anda tentang tabel periodik. Klik pada sebuah elemen untuk mempelajarinya, atau ajukan pertanyaan kepada saya!",
    },
  ], []);

  const loadQuiz = useCallback(async (testType: 'pre' | 'post') => {
    setIsQuizLoading(true);
    const questions = await generateQuiz(testType === 'pre' ? 'pengetahuan umum' : 'ulasan', TOTAL_QUESTIONS);
    setQuizQuestions(questions);
    setIsQuizLoading(false);
  }, []);

  useEffect(() => {
    const initChat = () => {
      try {
        const session = createTutorChatSession();
        setChatSession(session);
        setMessages(initialMessages);
      } catch (error)
      {
        console.error("Failed to initialize chat session:", error);
        setMessages([
          {
            sender: 'tutor',
            text: "Maaf, saya sedang kesulitan terhubung saat ini. Silakan periksa kunci API Anda dan segarkan halaman.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    initChat();
    loadQuiz('pre');
  }, [loadQuiz, initialMessages]);

  const handleSendMessage = useCallback(async (message: string, isUserInput: boolean = true) => {
    if (isLoading || !chatSession) return;

    setIsLoading(true);
    if (isUserInput) {
      setMessages((prev) => [...prev, { sender: 'user', text: message }]);
    }

    try {
      const response = await chatSession.sendMessage({ message });
      const tutorResponse = response.text;
      setMessages((prev) => [...prev, { sender: 'tutor', text: tutorResponse }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'tutor',
          text: "Maaf, saya mengalami kesalahan. Bisakah Anda mencoba lagi?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [chatSession, isLoading]);

  const handleElementClick = (element: ElementData) => {
    setSelectedElement(element);
    const prompt = `Ceritakan tentang elemen ${element.name} (${element.symbol}). Jelaskan properti utamanya dan kegunaan umumnya.`;
    // Reset messages to initial state plus the new prompt to keep the chat focused
    setMessages(initialMessages);
    handleSendMessage(prompt, false);
  };

  const handleUserMessage = async (message: string) => {
    await handleSendMessage(message, true);
  };

  const handlePreTestSubmit = async (score: number, answers: { question: QuizQuestion; answer: string }[]) => {
    setPreTestScore(score);
    const incorrectAnswers = answers
      .filter(a => a.answer !== a.question.correctAnswer)
      .map(a => ({
        question: a.question.question,
        userAnswer: a.answer,
        correctAnswer: a.question.correctAnswer
      }));
    
    setIsQuizLoading(true);
    const plan = await analyzeTestResults(incorrectAnswers);
    setLearningPlan(plan);
    setIsQuizLoading(false);
    setShowLearningPlan(true);
    setAppState('LEARNING');
  };

  const handleStartLearning = () => {
    setShowLearningPlan(false);
  };
  
  const handleStartPostTest = () => {
    setAppState('POST_TEST');
    loadQuiz('post');
  };

  const handlePostTestSubmit = (score: number) => {
    setPostTestScore(score);
    setAppState('RESULTS');
  };

  const handleRetake = () => {
    setAppState('PRE_TEST');
    setMessages(initialMessages);
    setSelectedElement(null);
    loadQuiz('pre');
  }

  const renderContent = () => {
    switch (appState) {
      case 'PRE_TEST':
        return <Quiz 
          title="Pra-Tes: Uji Pengetahuan Anda"
          questions={quizQuestions}
          onSubmit={handlePreTestSubmit}
          isLoading={isQuizLoading}
          totalQuestions={TOTAL_QUESTIONS}
        />;
      case 'LEARNING':
        return (
          <>
            {showLearningPlan && learningPlan && (
              <LearningPlan plan={learningPlan} onStartLearning={handleStartLearning} isLoading={isQuizLoading} />
            )}
            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-2rem)]">
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                   <ElementDetail element={selectedElement} />
                   <button 
                     onClick={handleStartPostTest}
                     className="ml-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-500 transition-colors shadow-lg"
                   >
                     Ambil Pasca-Tes
                   </button>
                </div>
                <div className="flex-grow overflow-y-auto">
                  <PeriodicTable onElementClick={handleElementClick} selectedElement={selectedElement} />
                </div>
              </div>
              <div className="lg:col-span-1 h-full">
                <ChatWindow
                  messages={messages}
                  onSendMessage={handleUserMessage}
                  isLoading={isLoading}
                />
              </div>
            </main>
          </>
        );
      case 'POST_TEST':
        return <Quiz 
          title="Pasca-Tes: Tunjukkan Apa yang Telah Anda Pelajari!"
          questions={quizQuestions}
          onSubmit={handlePostTestSubmit}
          isLoading={isQuizLoading}
          totalQuestions={TOTAL_QUESTIONS}
        />;
      case 'RESULTS':
        return <Results 
          preTestScore={preTestScore}
          postTestScore={postTestScore}
          totalQuestions={TOTAL_QUESTIONS}
          onRetake={handleRetake}
        />
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4">
      {renderContent()}
    </div>
  );
};

export default App;