import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

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
        return 'border-l-red-500';
      case 'friends':
        return 'border-l-purple-500';
      case 'family':
        return 'border-l-green-500';
      case 'self reflection':
        return 'border-l-blue-500';
      case 'party':
        return 'border-l-yellow-500';
      default:
        return 'border-l-gray-500';
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
      <DialogContent className="w-full max-w-[500px] mx-auto bg-background border-0 rounded-2xl p-0 overflow-hidden [&>button]:hidden" style={{ height: 'calc(100vh - 200px)' }}>
        <DialogDescription className="sr-only">
          Wählen Sie die Kategorien aus, die Sie sehen möchten
        </DialogDescription>
        <div className="flex flex-col h-[calc(100vh-200px)] md:h-[calc(100vh-130px)] relative w-full">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute right-6 top-6 z-10 text-white hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Header */}
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-white text-xl font-normal">
              Kategorien wählen
            </DialogTitle>
          </DialogHeader>

          {/* Categories List */}
          <div className="flex-1 px-6 space-y-3 overflow-y-auto">
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
                        className={`w-4 h-4 border border-white flex items-center justify-center bg-transparent`}
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          borderRadius: '2px',
                          outline: '1px solid white',
                          outlineOffset: '0px'
                        }}
                      >
                        {isSelected && (
                          <X 
                            className="text-white" 
                            style={{ width: '14px', height: '14px' }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}