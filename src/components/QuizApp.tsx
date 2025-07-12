import { useState, useEffect } from 'react';
import { QuizCard } from './QuizCard';

interface Question {
  id: number;
  question: string;
  category: string;
  type: string;
  author: string;
}

// Mock data für die erste Version
const mockQuestions: Question[] = [
  {
    id: 1,
    question: "Was ist deine Lieblings-Porno-Kategorie?",
    category: "FUCK",
    type: "FRAGETYP",
    author: "Autor"
  },
  {
    id: 2,
    question: "Welche Fantasie würdest du gerne mal ausleben?",
    category: "DIRTY",
    type: "FANTASY",
    author: "Anonymous"
  },
  {
    id: 3,
    question: "Was war dein peinlichster Moment beim Sex?",
    category: "FAIL",
    type: "STORY",
    author: "Nutzer123"
  },
  {
    id: 4,
    question: "An welchem ungewöhnlichen Ort hattest du schon mal Sex?",
    category: "WILD",
    type: "ERFAHRUNG",
    author: "Abenteurer"
  },
  {
    id: 5,
    question: "Was ist das Verrückteste, was du im Bett gemacht hast?",
    category: "CRAZY",
    type: "GESTÄNDNIS",
    author: "Wilde_Seele"
  },
  {
    id: 6,
    question: "Welches Spielzeug sollte jeder mal ausprobiert haben?",
    category: "TOYS",
    type: "EMPFEHLUNG",
    author: "Expert_69"
  }
];

export function QuizApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const [questions] = useState<Question[]>(mockQuestions);

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
      <div className="absolute top-0 left-0 right-0 z-10 bg-black">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="text-white">
            <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 35V8C5 6 6 5 8 5H20C22 5 23 6 23 8V12C23 14 22 15 20 15H12V20H18C20 20 21 21 21 23V27C21 29 20 30 18 30H12V35H5Z" fill="white"/>
              <path d="M30 35V8C30 6 31 5 33 5H45C47 5 48 6 48 8V12C48 14 47 15 45 15H37V20H43C45 20 46 21 46 23V27C46 29 45 30 43 30H37V35H30Z" fill="white"/>
              <path d="M55 35V8C55 6 56 5 58 5H70C72 5 73 6 73 8V12C73 14 72 15 70 15H62V20H68C70 20 71 21 71 23V27C71 29 70 30 68 30H62V35H55Z" fill="white"/>
            </svg>
          </div>
          <div className="text-white font-normal text-sm">Fuck, Friends or Family.</div>
        </div>
      </div>

      {/* Main Quiz Container */}
      <div className="h-screen flex items-center justify-center p-4 pt-20 pb-8">
        <div className="w-full max-w-2xl h-full max-h-[600px]">
          <QuizCard
            question={questions[currentIndex]}
            onSwipeLeft={nextQuestion}
            onSwipeRight={prevQuestion}
            animationClass={animationClass}
          />
        </div>
      </div>


    </div>
  );
}