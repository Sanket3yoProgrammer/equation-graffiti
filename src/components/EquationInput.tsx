import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Trash2, PlusCircle, Book, HelpCircle } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { SAMPLE_EQUATIONS } from '@/utils/mathUtils';
import { cn } from '@/lib/utils';

interface EquationInputProps {
  id: string;
  index: number;
  value: string;
  color: string;
  onUpdate: (id: string, value: string) => void;
  onRemove: (id: string) => void;
  error?: string;
}

const EquationInput: React.FC<EquationInputProps> = ({
  id,
  index,
  value,
  color,
  onUpdate,
  onRemove,
  error
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(id, e.target.value);
  };
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  const handleSampleSelect = (equation: string) => {
    onUpdate(id, equation);
  };
  
  return (
    <div 
      className={cn(
        "relative group flex items-center space-x-2 p-4 rounded-xl transition-all duration-300",
        isFocused ? "bg-secondary/50 shadow-sm" : "hover:bg-secondary/30",
        error ? "border border-destructive/50" : "border border-transparent"
      )}
    >
      <div 
        className="w-3 h-full rounded-full"
        style={{ backgroundColor: color }}
      />
      
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center mb-1">
          <span className="text-xs font-medium text-muted-foreground">
            Equation {index + 1}
          </span>
          {error && (
            <span className="ml-2 text-xs text-destructive animate-fade-in">
              {error}
            </span>
          )}
        </div>
        
        <div className="relative flex items-center">
          <Input
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Enter an equation (e.g., y = 2x + 3, x = 5, x + y = 4)"
            className="bg-transparent border-none shadow-none focus-visible:ring-0 h-8 text-sm"
          />
          
          

<Popover>
  <PopoverTrigger asChild>
    <Button variant="ghost" size="icon" className="h-8 w-8 ml-1 text-muted-foreground">
      <HelpCircle className="h-4 w-4" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="max-w-xs p-4">
    <div className="text-xs space-y-2">
      <p className="font-medium">Supported formats:</p>
      <ul className="space-y-1 ml-2">
        <li>• y = 2x + 3</li>
        <li>• 2x + 3 = y</li>
        <li>• x = 5</li>
        <li>• y = 7</li>
        <li>• x + y = 10</li>
        <li>• x^2 + y^2 = 25</li>
        <li>• 2x + 3 (assumed as y = 2x + 3)</li>
      </ul>
    </div>
  </PopoverContent>
</Popover>

        </div>
      </div>
      
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Book className="h-4 w-4" />
              <span className="sr-only">Examples</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {SAMPLE_EQUATIONS.slice(0, 5).map((sample) => (
              <DropdownMenuItem 
                key={sample.name}
                onClick={() => handleSampleSelect(sample.equation)}
                className="cursor-pointer"
              >
                {sample.name}
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            
            {SAMPLE_EQUATIONS.slice(5).map((sample) => (
              <DropdownMenuItem 
                key={sample.name}
                onClick={() => handleSampleSelect(sample.equation)}
                className="cursor-pointer"
              >
                {sample.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(id)}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Remove equation</span>
        </Button>
      </div>
    </div>
  );
};

interface EquationListProps {
  equations: Array<{
    id: string;
    equation: string;
    color: string;
    error?: string;
  }>;
  onUpdate: (id: string, value: string) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
  maxEquations?: number;
}

export const EquationList: React.FC<EquationListProps> = ({
  equations,
  onUpdate,
  onRemove,
  onAdd,
  maxEquations = 3
}) => {
  return (
    <div className="w-full space-y-2 animate-fade-in">
      {equations.map((eq, index) => (
        <EquationInput
          key={eq.id}
          id={eq.id}
          index={index}
          value={eq.equation}
          color={eq.color}
          onUpdate={onUpdate}
          onRemove={onRemove}
          error={eq.error}
        />
      ))}
      
      {equations.length < maxEquations && (
        <Button
          variant="outline"
          onClick={onAdd}
          className="w-full mt-2 py-6 border-dashed hover:border-primary hover:bg-primary/5 group transition-colors"
        >
          <PlusCircle className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
          <span>Add Equation</span>
        </Button>
      )}
    </div>
  );
};

export default EquationInput;
