import React, { useState } from 'react';
import { ArrowRight, Check, LightbulbIcon, Sparkles, Play, Zap, ArrowUpRight, Code2, Copy, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Examples = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const examples = [
    {
      title: "Linear Functions",
      description: "Plot two straight lines to find their intersection point",
      equations: ["y = 2x + 3", "y = -x + 6"],
      tip: "The intersection occurs at (1, 5) where both lines meet.",
      color: "from-blue-500 to-indigo-500",
      previewImage: "linear.png",
      difficulty: "Beginner"
    },
    {
      title: "Quadratic vs Linear",
      description: "Plot a parabola and a line to find two intersection points",
      equations: ["y = x^2 - 4", "y = x"],
      tip: "The intersections occur at (-1, -1) and (2, 2).",
      color: "from-purple-500 to-pink-500",
      previewImage: "quadratic.png",
      difficulty: "Intermediate"
    },
    {
      title: "Vertical & Horizontal Lines",
      description: "Plot vertical and horizontal lines",
      equations: ["x = 3", "y = 2"],
      tip: "The intersection point is at (3, 2).",
      color: "from-emerald-500 to-teal-500",
      previewImage: "lines.png",
      difficulty: "Beginner"
    },
    {
      title: "Trigonometric Functions",
      description: "Plot a sine wave and a line",
      equations: ["y = sin(x)", "y = 0.5"],
      tip: "Multiple intersection points occur where the sine wave crosses y = 0.5.",
      color: "from-orange-500 to-amber-500",
      previewImage: "trig.png",
      difficulty: "Advanced"
    }
  ];
  
  const goToNextExample = () => {
    if (currentStep < examples.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(0);
    }
  };

  const handleCopy = (index: number) => {
    navigator.clipboard.writeText(examples[currentStep].equations[index]);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  
  const currentExample = examples[currentStep];

  const difficultyColors = {
    Beginner: "text-emerald-500",
    Intermediate: "text-amber-500",
    Advanced: "text-rose-500"
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute w-full h-full">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-primary/5 rounded-full"
              initial={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0,
                opacity: 0
              }}
              animate={{
                scale: [0, 1, 1, 0],
                opacity: [0, 0.1, 0.1, 0],
                x: [null, Math.random() * window.innerWidth],
                y: [null, Math.random() * window.innerHeight]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 10
              }}
            />
          ))}
        </div>
      </div>

      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="fixed -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="fixed top-1/2 right-0 w-[30rem] h-[30rem] bg-gradient-to-bl from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="fixed bottom-20 -left-20 w-[28rem] h-[28rem] bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl"
      />
      
      <div className="fixed inset-0 bg-grid-primary/[0.02] bg-[size:20px_20px] [mask-image:linear-gradient(to_bottom,transparent,80%,white)] pointer-events-none" />
      
      <Header />
      
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 container max-w-6xl mx-auto px-4 py-12 relative z-10"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-4 mb-12"
        >
          <motion.div 
            className="inline-flex items-center px-4 py-2 rounded-full border bg-background/50 backdrop-blur-sm mb-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-4 h-4 mr-2 text-primary" />
            <span className="text-sm font-medium">Interactive Examples</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              Examples Gallery
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore these examples to understand how to use EquationGraffiti. Each example comes with interactive previews and ready-to-use equations.
          </p>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:w-1/4"
          >
            <div className="bg-card/70 backdrop-blur-md rounded-xl border p-6 sticky top-24 shadow-lg">
              <h3 className="font-medium mb-6 flex items-center gap-2 text-lg">
                <Play className="w-5 h-5 text-primary" />
                Examples
              </h3>
              <ul className="space-y-3">
                {examples.map((example, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <button
                      onClick={() => setCurrentStep(index)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-lg transition-all text-sm flex items-center gap-3 relative group overflow-hidden",
                        currentStep === index 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "hover:bg-primary/5"
                      )}
                    >
                      <div className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                        `bg-gradient-to-r ${example.color} opacity-10`
                      )} />
                      <div className="relative z-10 flex items-center gap-3 w-full">
                        {currentStep === index ? (
                          <Check className="h-4 w-4 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 shrink-0" />
                        )}
                        <span className="flex-1">{example.title}</span>
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full border",
                          difficultyColors[example.difficulty as keyof typeof difficultyColors]
                        )}>
                          {example.difficulty}
                        </span>
                      </div>
                    </button>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <LightbulbIcon className="w-4 h-4 text-primary" />
                  Pro Tip
                </div>
                <p className="text-sm text-muted-foreground">
                  Click on any equation to copy it to your clipboard. Then paste it directly into the app to try it out!
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Main example content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:w-3/4"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-card/70 backdrop-blur-md rounded-xl border p-8 shadow-lg relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="space-y-1">
                      <h2 className={cn(
                        "text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r",
                        currentExample.color
                      )}>
                        {currentExample.title}
                      </h2>
                      <div className={cn(
                        "text-sm",
                        difficultyColors[currentExample.difficulty as keyof typeof difficultyColors]
                      )}>
                        {currentExample.difficulty} Level
                      </div>
                    </div>
                    <Button 
                      onClick={goToNextExample}
                      variant="outline"
                      className="group flex items-center gap-2"
                    >
                      Next Example
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                  
                  <p className="text-muted-foreground mb-8">{currentExample.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Preview Image */}
                    <div className="bg-black/5 dark:bg-white/5 rounded-xl p-6 aspect-square flex items-center justify-center relative group overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <img 
                        src={`/examples/${currentExample.previewImage}`} 
                        alt={currentExample.title}
                        className="w-full h-full object-contain"
                      />
                      <Link
                        to="/app"
                        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Button size="sm" className="gap-2">
                          Try it out <ArrowUpRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>

                    {/* Equations */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-primary" />
                        Equations
                      </h3>
                      <div className="space-y-3">
                        {currentExample.equations.map((equation, index) => (
                          <motion.button
                            key={index}
                            className="w-full p-4 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-primary/5 transition-colors relative group text-left"
                            onClick={() => handleCopy(index)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="font-mono text-sm">{equation}</div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {copiedIndex === index ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4 text-primary" />
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>

                      {/* Tip Section */}
                      <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 text-sm font-medium mb-2">
                          <LightbulbIcon className="w-4 h-4 text-primary" />
                          Helpful Tip
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {currentExample.tip}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.main>

      <Footer />
    </div>
  );
};

export default Examples;
