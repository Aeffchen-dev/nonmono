import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Question {
  question: string;
  category: string;
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
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const minSwipeDistance = 50;

  // Get category-specific colors
  const getCategoryColors = (category: string) => {
    switch (category.toLowerCase()) {
      case 'fuck':
        return {
          bg: 'bg-quiz-fuck-bg',
          text: 'text-quiz-fuck-text'
        };
      case 'friends':
        return {
          bg: 'bg-quiz-friends-bg', 
          text: 'text-quiz-friends-text'
        };
      default:
        return {
          bg: 'bg-quiz-category-bg',
          text: 'text-quiz-category-text'
        };
    }
  };

  const categoryColors = getCategoryColors(question.category);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const currentX = e.targetTouches[0].clientX;
    const deltaX = currentX - touchStart;
    setDragX(deltaX);
    setTouchEnd(currentX);
  };

  const onTouchEnd = () => {
    setIsDragging(false);
    
    if (!touchStart || !touchEnd) {
      setDragX(0);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onSwipeLeft();
    } else if (isRightSwipe) {
      onSwipeRight();
    }
    
    // Reset position if no swipe
    setDragX(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Calculate transform values based on drag
  const rotation = Math.min(Math.max(dragX * 0.1, -15), 15);
  const scale = Math.max(1 - Math.abs(dragX) * 0.0005, 0.8);
  const opacity = Math.max(1 - Math.abs(dragX) * 0.002, 0.3);

  return (
    <div 
      className={`relative h-full w-full bg-gradient-surface rounded-3xl shadow-card overflow-hidden select-none ${animationClass}`}
      style={{
        transform: `translateX(${dragX}px) rotate(${rotation}deg) scale(${scale})`,
        opacity: opacity,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out'
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Category Strip */}
      <div className={`absolute left-0 top-0 h-full w-12 ${categoryColors.bg} flex items-center justify-center`}>
        <div className="transform -rotate-90 whitespace-nowrap">
          <span className={`${categoryColors.text} font-bold text-sm tracking-wide uppercase`}>
            {Array(20).fill(question.category).join('   ')}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-12 h-full flex flex-col justify-center p-8">

        {/* Question */}
        <div className="flex-1 flex items-start justify-start text-left px-2 pt-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-normal text-foreground leading-tight">
            {question.question}
          </h1>
        </div>

      </div>

    </div>
  );
}