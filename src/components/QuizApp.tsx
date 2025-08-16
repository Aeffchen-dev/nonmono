import { useState, useEffect } from 'react';
import { QuizCard } from './QuizCard';
import { CategorySelector } from './CategorySelector';
import { IntroSlide } from './IntroSlide';

interface Question {
  question: string;
  category: string;
}

interface SlideItem {
  type: 'intro' | 'question';
  introType?: 'welcome' | 'description';
  question?: Question;
}

export function QuizApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categorySelectorOpen, setCategorySelectorOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      // Convert Google Sheets URL to CSV export URL
      const spreadsheetId = '1ocX6XRk_Y_HcUCg7hcjb1nHuoKqyBUc2KmWX9JNTXrU';
      const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=0`;
      
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch spreadsheet data');
      }
      
      const csvText = await response.text();
      
      // Parse CSV data (skip header row if exists)
      const lines = csvText.split('\n').filter(line => line.trim());
      const questions: Question[] = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Proper CSV parsing to handle quoted fields with commas
        const values: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          
          if (char === '"') {
            if (inQuotes && line[j + 1] === '"') {
              // Escaped quote
              current += '"';
              j++; // Skip next quote
            } else {
              // Toggle quote state
              inQuotes = !inQuotes;
            }
          } else if (char === ',' && !inQuotes) {
            // Field separator outside quotes
            values.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        
        // Add the last field
        values.push(current.trim());
        
        if (values.length >= 2 && values[0] && values[1]) {
          questions.push({
            category: values[0],
            question: values[1]
          });
        }
      }
      
      if (questions.length > 0) {
        // Separate Reflexion questions from others
        const reflexionQuestions = questions.filter(q => q.category === 'Reflexion');
        const otherQuestions = questions.filter(q => q.category !== 'Reflexion');
        
        // Shuffle both groups
        const shuffledOthers = [...otherQuestions].sort(() => Math.random() - 0.5);
        const shuffledReflexion = [...reflexionQuestions].sort(() => Math.random() - 0.5);
        
        // Calculate position for last third
        const totalQuestions = questions.length;
        const lastThirdStart = Math.floor(totalQuestions * 2 / 3);
        
        // Create ordered array: others first, then reflexion in last third
        const orderedQuestions = [
          ...shuffledOthers.slice(0, lastThirdStart),
          ...shuffledReflexion,
          ...shuffledOthers.slice(lastThirdStart)
        ];
        
        setAllQuestions(orderedQuestions);
        setQuestions(orderedQuestions);
        
        // Create slides with intro slides at the beginning
        const introSlides: SlideItem[] = [
          { type: 'intro', introType: 'welcome' },
          { type: 'intro', introType: 'description' }
        ];
        
        const questionSlides: SlideItem[] = orderedQuestions.map(q => ({
          type: 'question',
          question: q
        }));
        
        setSlides([...introSlides, ...questionSlides]);
        
        // Extract unique categories
        const categories = Array.from(new Set(questions.map(q => q.category)));
        setAvailableCategories(categories);
        setSelectedCategories(categories); // Start with all categories selected
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < slides.length - 1) {
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

  // Filter questions based on selected categories
  useEffect(() => {
    if (selectedCategories.length === 0) {
      setQuestions([]);
      setSlides([
        { type: 'intro', introType: 'welcome' },
        { type: 'intro', introType: 'description' }
      ]);
    } else {
      const filteredQuestions = allQuestions.filter(q => 
        selectedCategories.includes(q.category)
      );
      setQuestions(filteredQuestions);
      
      // Create slides with intro slides at the beginning
      const introSlides: SlideItem[] = [
        { type: 'intro', introType: 'welcome' },
        { type: 'intro', introType: 'description' }
      ];
      
      const questionSlides: SlideItem[] = filteredQuestions.map(q => ({
        type: 'question',
        question: q
      }));
      
      setSlides([...introSlides, ...questionSlides]);
      setCurrentIndex(0); // Reset to first slide when filtering
    }
  }, [selectedCategories, allQuestions]);

  const handleCategoriesChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };

  return (
    <div className="h-screen h-[100svh] bg-background overflow-hidden">
      {/* App Header */}
      <div className="bg-black">
        <div className="flex justify-between items-center px-6 py-3">
          <h1 className="text-white font-kokoro text-lg" style={{ fontFamily: 'Kokoro, serif', fontWeight: 'bold', fontStyle: 'italic' }}>Open Relationship</h1>
          <button 
            onClick={() => setCategorySelectorOpen(true)}
            className="text-white font-normal text-xs flex items-center"
          >
            Kategorien wählen
          </button>
        </div>
      </div>

      {/* Main Quiz Container */}
      <div className="h-[calc(100vh-60px)] h-[calc(100svh-60px)] flex flex-col items-center px-4 pt-4 overflow-hidden">
        <div className="w-full h-[calc(100vh-200px)] h-[calc(100svh-200px)] md:h-[calc(100vh-130px)] md:h-[calc(100svh-130px)] flex items-center justify-center">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-white text-xl">Lade Fragen...</div>
            </div>
          ) : slides.length > 0 ? (
            slides[currentIndex].type === 'intro' ? (
              <IntroSlide
                type={slides[currentIndex].introType!}
                onSwipeLeft={nextQuestion}
                onSwipeRight={prevQuestion}
                animationClass={animationClass}
              />
            ) : (
              <QuizCard
                question={slides[currentIndex].question!}
                onSwipeLeft={nextQuestion}
                onSwipeRight={prevQuestion}
                animationClass={animationClass}
              />
            )
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-white text-xl">Keine Fragen verfügbar</div>
            </div>
          )}
        </div>
        
        {/* Bottom Links */}
        <div className="flex justify-between items-center pt-4 w-full px-2">
          <a 
            href="https://relationshipbydesign.de/" 
            className="text-white font-normal text-xs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Relationship by design
          </a>
          <a 
            href="mailto:hello@relationshipbydesign.de?subject=Feedback%20Open%20Relationship%20Workshop" 
            className="text-white font-normal text-xs"
          >
            Feedback geben
          </a>
        </div>
      </div>
      
      <CategorySelector
        open={categorySelectorOpen}
        onOpenChange={setCategorySelectorOpen}
        categories={availableCategories}
        selectedCategories={selectedCategories}
        onCategoriesChange={handleCategoriesChange}
      />
    </div>
  );
}