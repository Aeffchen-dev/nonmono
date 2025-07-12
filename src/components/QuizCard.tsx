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
  const [mouseStart, setMouseStart] = useState<number | null>(null);
  const [mouseEnd, setMouseEnd] = useState<number | null>(null);
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
      case 'self reflection':
        return {
          bg: 'bg-quiz-self-reflection-bg',
          text: 'text-quiz-self-reflection-text'
        };
      case 'party':
        return {
          bg: 'bg-quiz-party-bg',
          text: 'text-quiz-party-text'
        };
      case 'family':
        return {
          bg: 'bg-quiz-family-bg',
          text: 'text-quiz-family-text'
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

  // Mouse drag handlers for desktop
  const onMouseDown = (e: React.MouseEvent) => {
    setMouseEnd(null);
    setMouseStart(e.clientX);
    setIsDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setMouseEnd(e.clientX);
  };

  const onMouseUp = () => {
    if (!isDragging || !mouseStart || !mouseEnd) {
      setIsDragging(false);
      return;
    }
    
    const distance = mouseStart - mouseEnd;
    const isLeftDrag = distance > minSwipeDistance;
    const isRightDrag = distance < -minSwipeDistance;

    if (isLeftDrag) {
      onSwipeLeft();
    } else if (isRightDrag) {
      onSwipeRight();
    }
    
    setIsDragging(false);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className={`relative h-full w-full max-w-[500px] mx-auto bg-[hsl(var(--card-background))] rounded-2xl shadow-card overflow-hidden select-none ${animationClass}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {/* Left Click Area - Previous */}
      <div 
        className="absolute left-0 top-0 w-20 h-full z-10 cursor-pointer"
        onClick={onSwipeRight}
      />

      {/* Right Click Area - Next */}
      <div 
        className="absolute right-0 top-0 w-20 h-full z-10 cursor-pointer"
        onClick={onSwipeLeft}
      />

      {/* Category Strip */}
      <div className={`absolute left-0 top-0 h-full w-8 ${categoryColors.bg} flex items-center justify-center`}>
        <div className="transform -rotate-90 whitespace-nowrap">
          {Array(20).fill(question.category).map((cat, index) => (
            <span key={index} className={`${categoryColors.text} font-bold text-sm tracking-wide uppercase`} style={{ marginRight: index < 19 ? '8px' : '0' }}>
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-8 h-full flex flex-col justify-center pl-8 pr-8">

        {/* Question */}
        <div className="flex-1 flex items-start justify-start text-left pt-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-normal text-foreground leading-tight break-words overflow-wrap-anywhere whitespace-pre-wrap">
            {question.question}
          </h1>
        </div>

      </div>

    </div>
  );
}