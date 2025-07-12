import { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

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

  const getCategoryColors = (category: string) => {
    switch (category.toLowerCase()) {
      case 'fuck':
        return 'border-l-red-500 bg-red-500/10';
      case 'friends':
        return 'border-l-purple-500 bg-purple-500/10';
      case 'family':
        return 'border-l-green-500 bg-green-500/10';
      case 'self reflection':
        return 'border-l-blue-500 bg-blue-500/10';
      case 'party':
        return 'border-l-yellow-500 bg-yellow-500/10';
      default:
        return 'border-l-gray-500 bg-gray-500/10';
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

  const handleCancel = () => {
    setTempSelection(selectedCategories);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[500px] h-full max-h-[600px] bg-background border-0 rounded-2xl p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-white text-xl font-normal">
                Kategorien wählen
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="text-white hover:bg-white/10"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </DialogHeader>

          {/* Categories List */}
          <div className="flex-1 px-6 space-y-4 overflow-y-auto">
            {categories.map((category) => {
              const isSelected = tempSelection.includes(category);
              const colorClasses = getCategoryColors(category);
              
              return (
                <div 
                  key={category}
                  className={`flex items-center justify-between p-4 border-l-4 ${colorClasses} rounded-r-lg cursor-pointer transition-all duration-200 hover:bg-opacity-20`}
                  onClick={() => handleCategoryToggle(category)}
                >
                  <span className="text-white font-bold text-lg uppercase tracking-wide">
                    {category}
                  </span>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleCategoryToggle(category)}
                    className="h-6 w-6 border-2 border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                  />
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-6 pt-4 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="text-white font-normal hover:bg-white/10"
            >
              Kategorien wählen
            </Button>
            <Button
              onClick={handleApply}
              className="text-black bg-white hover:bg-white/90 font-normal"
            >
              Frage einreichen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}