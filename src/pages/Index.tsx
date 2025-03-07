import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { EquationList } from '@/components/EquationInput';
import Graph from '../components/Graph';
import HistoryPanel from '../components/HistoryPanel';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock } from 'lucide-react';
import { 
  LineData, 
  evaluateEquation, 
  generateXValues, 
  findIntersections, 
  DEFAULT_RANGE 
} from '@/utils/mathUtils';
import { useToast } from '@/components/ui/use-toast';
import { openDB } from 'idb';

const Index = () => {
  const { toast } = useToast();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  // State for equations
  const [equations, setEquations] = useState<Array<{
    id: string;
    equation: string;
    color: string;
    error?: string;
  }>>([
    { id: uuidv4(), equation: 'x^2', color: '#ff6b6b' },
    { id: uuidv4(), equation: '2*x + 3', color: '#4ecdc4' }
  ]);
  
  // Generate x values for plotting
  const xValues = useMemo(() => 
    generateXValues(DEFAULT_RANGE.min, DEFAULT_RANGE.max, DEFAULT_RANGE.steps), 
    []
  );
  
  // Generate line data for each equation
  const lineData: LineData[] = useMemo(() => {
    return equations.map(eq => {
      const { points, error } = evaluateEquation(eq.equation, xValues);
      return {
        id: eq.id,
        equation: eq.equation,
        color: eq.color,
        points,
        error
      };
    });
  }, [equations, xValues]);
  
  // Find intersections between lines
  const intersections = useMemo(() => {
    if (lineData.length < 2) return [];
    
    let allIntersections = [];
    
    // Find intersections between all pairs of lines
    for (let i = 0; i < lineData.length; i++) {
      for (let j = i + 1; j < lineData.length; j++) {
        const points = findIntersections(lineData[i], lineData[j]);
        allIntersections.push(...points);
      }
    }
    
    return allIntersections;
  }, [lineData]);
  
  // Save current equations to history
  const saveToHistory = () => {
    const validEquations = equations.filter(eq => eq.equation.trim() !== '' && !eq.error);
    if (validEquations.length === 0) return;

    const historyEntry = {
      id: uuidv4(),
      equations: validEquations.map(eq => eq.equation),
      colors: validEquations.map(eq => eq.color),
      timestamp: Date.now()
    };

    const savedHistory = localStorage.getItem('equation-history');
    const history = savedHistory ? JSON.parse(savedHistory) : [];
    const newHistory = [historyEntry, ...history].slice(0, 50); // Keep last 50 entries
    localStorage.setItem('equation-history', JSON.stringify(newHistory));

    toast({
      title: "Equations Saved!",
      description: "Your equations have been successfully stored.",
      duration: 2000,
      className: "bg-green-600 text-white border-0 shadow-lg",
      // icon: <CheckCircle className="text-white" />,
    });
  };

  // Load equations from history
  const loadFromHistory = (historyEquations: string[]) => {
    const colors = ['#ff6b6b', '#4ecdc4', '#1a535c', '#ffbe0b', '#fb5607'];
    const newEquations = historyEquations.map((equation, index) => ({
      id: uuidv4(),
      equation,
      color: colors[index % colors.length]
    }));
    setEquations(newEquations);
    setIsHistoryOpen(false);
    
    toast ({
      title: "Equations Loaded",
      description: "Historical equations have been loaded into the graph.",
      duration: 2000
    });
  };
  
  // Handle equation update
  const handleEquationUpdate = (id: string, value: string) => {
    setEquations(prevEquations => 
      prevEquations.map(eq => 
        eq.id === id ? { ...eq, equation: value } : eq
      )
    );
  };
  
  // Handle equation removal
  const handleEquationRemove = (id: string) => {
    setEquations(prevEquations => 
      prevEquations.filter(eq => eq.id !== id)
    );
  };
  
  // Handle adding a new equation
  const handleAddEquation = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#1a535c', '#ffbe0b', '#fb5607'];
    const newColor = colors[Math.min(equations.length, colors.length - 1)];
    
    setEquations(prevEquations => [
      ...prevEquations,
      { id: uuidv4(), equation: '', color: newColor }
    ]);
  };
  
  // Update errors in equations based on evaluation results
  useEffect(() => {
    setEquations(prevEquations => 
      prevEquations.map(eq => {
        const lineInfo = lineData.find(line => line.id === eq.id);
        return { 
          ...eq, 
          error: lineInfo?.error
        };
      })
    );
  }, [lineData]);

  // Save equations to history when they change
  useEffect(() => {
    const validEquations = equations.filter(eq => eq.equation.trim() !== '' && !eq.error);
    if (validEquations.length > 0) {
      const debouncedSave = setTimeout(saveToHistory, 2000);
      return () => clearTimeout(debouncedSave);
    }
  }, [equations]);

  const [savedEquations, setSavedEquations] = useState<{ id: number; equations: string[] }[]>([]);

  useEffect(() => {
    const loadSavedEquations = async () => {
      const db = await openDB("GraphDB", 1);
      const allEquations = await db.getAll("equations");
      setSavedEquations(allEquations);
    };
    loadSavedEquations();
  }, []);

  const saveEquations = async () => {
    const db = await openDB("GraphDB", 1);
    await db.add("equations", { equations: lineData.map(line => line.equation) });
    const allEquations = await db.getAll("equations");
    setSavedEquations(allEquations);
  };

  const deleteEquationSet = async (id: number) => {
    const db = await openDB("GraphDB", 1);
    await db.delete("equations", id);
    const allEquations = await db.getAll("equations");
    setSavedEquations(allEquations);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Equation<span className="text-primary">Graffiti</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Visualize mathematical relationships with elegance and precision.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-card rounded-xl border shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Equations</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsHistoryOpen(true);
                  }}
                  className="flex items-center gap-2 transition-transform duration-200 transform hover:scale-105 active:scale-95"
                >
                  <Clock className="w-4 h-4" />
                  <span>Saved Equations</span>
                </Button>
              </div>
              <EquationList
                equations={equations}
                onUpdate={handleEquationUpdate}
                onRemove={handleEquationRemove}
                onAdd={handleAddEquation}
                maxEquations={3}
              />
            </div>
            
            <div className="bg-card rounded-xl border shadow-sm p-4">
              <h3 className="text-lg font-medium mb-2">Instructions</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Enter equations in any standard format:</li>
                <li className="ml-4">- <span className="font-medium text-foreground">y = 2x + 3</span> (explicit)</li>
                <li className="ml-4">- <span className="font-medium text-foreground">x = 5</span> (vertical line)</li>
                <li className="ml-4">- <span className="font-medium text-foreground">x + y = 7</span> (implicit)</li>
                <li>• Use <span className="font-medium text-foreground">*</span> for multiplication (e.g., 2*x)</li>
                <li>• Use <span className="font-medium text-foreground">^</span> for exponents (e.g., x^2)</li>
                <li>• Use functions like <span className="font-medium text-foreground">sin(), cos(), sqrt()</span></li>
                <li>• Zoom in/out to explore the graph</li>
              </ul>
            </div>
          </div>
          
          <div className="lg:col-span-8">
            <div className="bg-card rounded-xl border shadow-sm p-4 h-full">
              <Graph lines={lineData} intersections={intersections} />
            </div>
          </div>
        </div>
      </main>
      
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectEquations={loadFromHistory}
        savedEquations={savedEquations}
      />
      
      <Footer />
    </div>
  );
};

export default Index;
