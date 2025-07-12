import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  category: string;
  type: string;
  author: string;
}

interface QuizCardProps {
  question: Question;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  animationClass?: string;
}

export function QuizCard({ question, onSwipeLeft, onSwipeRight, animationClass = '' }: QuizCardProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onSwipeLeft();
    } else if (isRightSwipe) {
      onSwipeRight();
    }
  };

  return (
    <div 
      className={`relative h-full w-full bg-gradient-surface rounded-3xl shadow-card overflow-hidden select-none ${animationClass}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Category Strip */}
      <div className="absolute left-0 top-0 h-full w-16 bg-quiz-category-bg flex items-center justify-center">
        <div className="transform -rotate-90 whitespace-nowrap">
          <span className="text-quiz-category-text font-bold text-sm tracking-widest uppercase">
            {question.category.repeat(8).split('').join(' ').substring(0, 100)}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-16 h-full flex flex-col justify-between p-8">
        {/* Question Type */}
        <div className="text-center">
          <div className="inline-block px-4 py-2 border border-foreground/20 rounded-full">
            <span className="text-sm font-medium text-foreground/80 uppercase tracking-wide">
              {question.type}
            </span>
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 flex items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            {question.question}
          </h1>
        </div>

        {/* Author */}
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            {question.author}
          </p>
        </div>
      </div>

      {/* Navigation Hints */}
      <div className="absolute top-1/2 left-20 transform -translate-y-1/2 opacity-30 hover:opacity-60 transition-opacity">
        <ChevronLeft className="w-6 h-6 text-foreground" />
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 opacity-30 hover:opacity-60 transition-opacity">
        <ChevronRight className="w-6 h-6 text-foreground" />
      </div>
    </div>
  );
}