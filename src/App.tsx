import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import GraphApp from "./pages/Index";
import About from "./pages/About";
import Examples from "./pages/Examples";
import NotFound from "./pages/NotFound";
import Loader from "./components/Loader.tsx";

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2500); // Adjust time as needed
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                className="fixed inset-0 flex items-center justify-center bg-black z-50"
                initial={{ scale: 0.1, opacity: 1 }} // Tiny at start
                animate={{ scale: 1, opacity: 1 }} // Expands
                exit={{
                  scale: 20, // Expands way beyond the screen
                  opacity: 0, // Fades out smoothly
                  transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] },
                }}
              >
                <Loader />
              </motion.div>
            ) : (
              <motion.div
                key="app"
                initial={{ scale: 2, opacity: 0 }} // Initially zoomed out
                animate={{ scale: 1, opacity: 1 }} // Expands into normal view
                transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
              >
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/examples" element={<Examples />} />
                    <Route path="/app" element={<GraphApp />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </motion.div>
            )}
          </AnimatePresence>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
