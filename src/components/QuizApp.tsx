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
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center">
        <div className="text-foreground/60 text-sm">
          {currentIndex + 1} / {questions.length}
        </div>
        <div className="text-foreground/60 text-sm">
          Quiz Game
        </div>
      </div>

      {/* Main Quiz Container */}
      <div className="h-screen flex items-center justify-center p-4 pt-16 pb-8">
        <div className="w-full max-w-2xl h-full max-h-[600px]">
          <QuizCard
            question={questions[currentIndex]}
            onSwipeLeft={nextQuestion}
            onSwipeRight={prevQuestion}
            animationClass={animationClass}
          />
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-quiz-primary shadow-glow' 
                  : 'bg-foreground/20'
              }`}
            />
          ))}
        </div>
      </div>

    </div>
  );
}