
import { useState, useEffect } from 'react';

interface EquationHistoryEntry {
  id: string;
  equation: string;
  color: string;
  timestamp: number;
}

export const useEquationHistory = () => {
  const [history, setHistory] = useState<EquationHistoryEntry[]>([]);
  
  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('equationHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);
  
  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('equationHistory', JSON.stringify(history));
  }, [history]);
  
  const addToHistory = (entry: Omit<EquationHistoryEntry, 'timestamp'>) => {
    setHistory(prev => {
      const newEntry = { ...entry, timestamp: Date.now() };
      return [newEntry, ...prev].slice(0, 50); // Keep last 50 entries
    });
  };
  
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('equationHistory');
  };
  
  return {
    history,
    addToHistory,
    clearHistory
  };
};
