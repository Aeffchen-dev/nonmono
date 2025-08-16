import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CategorySelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: string[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

export function CategorySelector({ 
  open, 
  onOpenChange, 
  categories, 
  selectedCategories, 
  onCategoriesChange 
}: CategorySelectorProps) {
  const [tempSelection, setTempSelection] = useState<string[]>(selectedCategories);

  // Update temp selection when selectedCategories prop changes
  useEffect(() => {
    setTempSelection(selectedCategories);
  }, [selectedCategories]);

  const getCategoryColors = (category: string) => {
    switch (category.toLowerCase()) {
      case 'fuck':
        return 'border-l-quiz-fuck-bg';
      case 'friends':
        return 'border-l-quiz-friends-bg';
      case 'family':
        return 'border-l-quiz-family-bg';
      case 'self reflection':
        return 'border-l-quiz-self-reflection-bg';
      case 'party':
        return 'border-l-quiz-party-bg';
      case 'connection':
        return 'border-l-quiz-connection-bg';
      case 'identity':
        return 'border-l-quiz-identity-bg';
      case 'career':
        return 'border-l-quiz-career-bg';
      case 'travel':
        return 'border-l-quiz-travel-bg';
      case 'health':
        return 'border-l-quiz-health-bg';
      case 'money':
        return 'border-l-quiz-money-bg';
      case 'love':
        return 'border-l-quiz-love-bg';
      case 'hobby':
        return 'border-l-quiz-hobby-bg';
      case 'dreams':
        return 'border-l-quiz-dreams-bg';
      case 'fear':
        return 'border-l-quiz-fear-bg';
      case 'wisdom':
        return 'border-l-quiz-wisdom-bg';
      case 'future':
        return 'border-l-quiz-future-bg';
      default:
        return 'border-l-quiz-category-bg';
    }
  };

  const handleCategoryToggle = (category: string) => {
    setTempSelection(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleApply = () => {
    onCategoriesChange(tempSelection);
    onOpenChange(false);
  };

  const handleClose = () => {
    onCategoriesChange(tempSelection); // Apply changes when closing
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[500px] mx-auto bg-background border-0 rounded-2xl p-0 overflow-hidden [&>button]:hidden h-[100svh] md:h-[90vh]">
        <DialogDescription className="sr-only">
          Wählen Sie die Kategorien aus, die Sie sehen möchten
        </DialogDescription>
        <div className="flex flex-col h-full relative w-full max-h-full min-h-0">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute right-6 top-6 z-10 text-white hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Header */}
          <DialogHeader className="absolute top-6 left-6 z-10">
            <DialogTitle className="text-white text-xl font-normal">
              Kategorien wählen
            </DialogTitle>
          </DialogHeader>

          {/* Categories List */}
          <ScrollArea className="flex-1 pt-20 min-h-0">
            <div className="px-6 space-y-3 pb-6">
              {categories.map((category) => {
              const isSelected = tempSelection.includes(category);
              const colorClasses = getCategoryColors(category);
              
              return (
                <div 
                  key={category}
                  className={`flex items-center justify-between p-4 border-l-8 ${colorClasses} bg-[#161616] cursor-pointer`}
                  style={{ borderRadius: '4px' }}
                  onClick={() => handleCategoryToggle(category)}
                >
                  <span className="text-white font-bold text-sm uppercase tracking-wide">
                    {category}
                  </span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <div
                      className="relative cursor-pointer"
                      onClick={() => {
                        const newCategories = isSelected 
                          ? tempSelection.filter(c => c !== category)
                          : [...tempSelection, category];
                        setTempSelection(newCategories);
                      }}
                    >
                      <div
                        className={`w-5 h-5 border border-white flex items-center justify-center ${isSelected ? 'bg-white' : 'bg-transparent'}`}
                        style={{ 
                          width: '20px', 
                          height: '20px', 
                          borderRadius: '24px',
                          outline: '1px solid white',
                          outlineOffset: '0px'
                        }}
                      >
                        {isSelected && (
                          <Check 
                            className="text-black" 
                            style={{ width: '14px', height: '14px' }}
                            strokeWidth={2}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}