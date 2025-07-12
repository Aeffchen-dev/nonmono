import { useState, useEffect } from 'react';
import { QuizCard } from './QuizCard';
import { supabase } from '@/integrations/supabase/client';

interface Question {
  question: string;
  category: string;
}

export function QuizApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('Friends App Questions')
        .select('*');
      
      if (error) {
        console.error('Error fetching questions:', error);
        return;
      }
      
      if (data) {
        setQuestions(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setAnimationClass('animate-slide-out-left');
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setAnimationClass('animate-slide-in-right');
        setTimeout(() => setAnimationClass(''), 500);
      }, 300);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setAnimationClass('animate-slide-out-right');
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setAnimationClass('animate-slide-in-left');
        setTimeout(() => setAnimationClass(''), 500);
      }, 300);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevQuestion();
    } else if (e.key === 'ArrowRight') {
      nextQuestion();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex]);

  return (
    <div className="min-h-screen bg-quiz-background overflow-hidden">
      {/* App Header */}
      <div className="bg-black">
        <div className="flex justify-between items-center px-6 py-3">
          <div className="text-white font-black text-3xl">fff</div>
          <div className="text-white font-normal text-xs">Fuck, Friends or Family.</div>
        </div>
      </div>

      {/* Main Quiz Container */}
      <div className="h-[calc(100vh-60px)] h-[calc(100dvh-60px)] flex items-center justify-center p-4 pt-4">
        <div className="w-full max-w-2xl h-full max-h-[calc(100vh-160px)] max-h-[calc(100dvh-160px)]">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-white text-xl">Lade Fragen...</div>
            </div>
          ) : questions.length > 0 ? (
            <QuizCard
              question={questions[currentIndex]}
              onSwipeLeft={nextQuestion}
              onSwipeRight={prevQuestion}
              animationClass={animationClass}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-white text-xl">Keine Fragen verfügbar</div>
            </div>
          )}
        </div>
      </div>


    </div>
  );
}