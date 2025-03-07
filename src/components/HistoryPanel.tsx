import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Clock, ArrowUpRight, X, Copy, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { openDB } from "idb";

export interface HistoryEntry {
  id: number;
  equations: string[];
  timestamp: number;
}

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEquations: (equations: string[]) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, onSelectEquations }) => {
  const [savedEquations, setSavedEquations] = useState<HistoryEntry[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<{ [key: string]: boolean }>({}); // Track copied icons
  const [loading, setLoading] = useState(false);
  const [reloadSpin, setReloadSpin] = useState(false);

  

  

  useEffect(() => {
    const loadSavedEquations = async () => {
      const db = await openDB("GraphDB", 1, {
        upgrade(db) {
          db.createObjectStore("equations", { keyPath: "id", autoIncrement: true });
        },
      });
      const allEquations = await db.getAll("equations");
      setSavedEquations(allEquations);
    };
    loadSavedEquations();
  }, []);

  const deleteEquationSet = async (id: number) => {
    const db = await openDB("GraphDB", 1);
    await db.delete("equations", id);
    setSavedEquations((prev) => prev.filter((set) => set.id !== id));
  };

  const copyEquation = (equation: string, index: string) => {
    navigator.clipboard.writeText(equation);
    setCopiedIndex((prev) => ({ ...prev, [index]: true }));

    setTimeout(() => {
      setCopiedIndex((prev) => ({ ...prev, [index]: false })); // Reset icon after 1.5s
    }, 1500);
  };


  const reloadEquations = async () => {
    setLoading(true);
    setReloadSpin(true); // Start spin animation
    const db = await openDB("GraphDB", 1);
    const allEquations = await db.getAll("equations");
    setSavedEquations(allEquations);
    setLoading(false);
  
    setTimeout(() => setReloadSpin(false), 500); // Stop spin smoothly
  };
  

  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed right-0 top-0 bottom-0 w-96 bg-background/95 backdrop-blur-xl border-l shadow-2xl z-50 flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Saved Equations</h2>
            </div>

            <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={reloadEquations} disabled={loading}>
              <motion.div
                animate={{ rotate: reloadSpin ? 360 : 0 }}
                transition={{ duration: 0.5, ease: "linear" }}
              >
                <RefreshCw className="w-4 h-4 text-primary" />
              </motion.div>
            </Button>


            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <AnimatePresence>
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-muted-foreground py-8"
              >
                Loading equations...
              </motion.div>
            ) : savedEquations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-muted-foreground py-8"
              >
                No saved equations yet. Save some to view here!
              </motion.div>
            ) : (
                <div className="space-y-4">
                  {savedEquations.map((set, index ) => ( // Use index here
                  <motion.div
                    key={set.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="rounded-lg border p-4 group relative hover:shadow-lg transition-shadow"
                  >
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.div whileTap={{ scale: 0.9, y: 2 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEquationSet(set.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        </motion.div>
                      </div>

                      <div className="mb-3 text-sm text-muted-foreground">
                        {set.timestamp
                          ? format(new Date(set.timestamp), "MMM d, yyyy h:mm a")
                          : "Unknown Date"}
                      </div>

                      <div className="space-y-2 mb-4">
                        {set.equations.map((eq, i) => {
                          const indexKey = `${set.id}-${i}`; // Unique key for each equation
                          return (
                            <div key={indexKey} className="flex items-center gap-2">
                              <code className="text-sm font-mono bg-muted px-2 py-1 rounded flex-1">
                                {eq}
                              </code>
                              <Button variant="ghost" onClick={() => copyEquation(eq, indexKey)}>
                                <AnimatePresence mode="wait">
                                  {copiedIndex[indexKey] ? (
                                    <motion.div
                                      key="checked"
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      exit={{ scale: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                    </motion.div>
                                  ) : (
                                    <motion.div
                                      key="copy"
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      exit={{ scale: 0, opacity: 0 }}
                                      transition={{ duration: 0.1 }}
                                    >
                                      <Copy className="w-4 h-4 text-primary" />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </Button>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex gap-2">
                      <motion.div whileTap={{ scale: 0.9, y: 2 }}>
                         <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyEquation(set.equations.join(", "), `copy-all-${set.id}`)}
                          className="w-full border border-white/20 bg-white/10 
                          hover:bg-white/20 hover:border-primary/50 
                          hover:shadow-[0px_0px_10px_0px_rgba(255,255,255,0.2)] 
                          active:scale-[0.95] transition-all"                        >
                          Copy All
                        </Button>
                        </motion.div>

                        <motion.div whileTap={{ scale: 0.9, y: 2 }}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSelectEquations(set.equations)}
                          className="w-full border border-white/20 bg-white/10 
                          hover:bg-white/20 hover:border-primary/50 
                          hover:shadow-[0px_0px_10px_0px_rgba(255,255,255,0.2)] 
                          active:scale-[0.95] transition-all"
                        >
                          <span>Re-plot</span>
                          <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HistoryPanel;
