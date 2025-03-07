import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, Home, User2, BookOpen, Sparkles, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navigation = [
    { name: 'Home', href: '/', icon: <Home className="w-4 h-4" /> },
    { name: 'Examples', href: '/examples', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'About', href: '/about', icon: <User2 className="w-4 h-4" /> },
    { name: 'App', href: '/app', icon: <PenTool className="w-4 h-4" /> }
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2 group">
            <div className="p-1 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <span className="hidden font-bold sm:inline-block group-hover:text-primary transition-colors duration-300">Equation Graffiti</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center space-x-2 transition-colors relative group',
                  item.href === '/app'
                    ? 'px-4 py-1.5 rounded-full bg-primary hover:bg-primary/90 [&>*]:text-white dark:[&>*]:text-gray-800'
                    : 'hover:text-primary',
                  location.pathname === item.href
                    ? 'text-primary'
                    : item.href === '/app'
                      ? ''
                      : 'text-muted-foreground'
                )}
              >
                <span className="relative">
                  {item.icon}
                  {item.href !== '/app' && (
                    <span className={cn(
                      "absolute -bottom-2 left-0 right-0 h-0.5 bg-primary scale-x-0 transition-transform duration-300",
                      location.pathname === item.href && "scale-x-100"
                    )} />
                  )}
                </span>
                <span>{item.name}</span>
                {item.href !== '/app' && (
                  <span className="absolute inset-x-0 -bottom-[2px] h-[1px] bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
                {item.href === '/app' && (
                  <motion.div
                    className="absolute -inset-[3px] bg-primary/20 rounded-full -z-10"
                    initial={false}
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [0.2, 0.3, 0.2]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <button 
              onClick={() => setIsMenuOpen(true)} 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open main menu</span>
            </button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="hover:bg-primary/10 transition-colors duration-300 relative"
          >
            <div className="relative w-5 h-5">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: theme === "light" ? 1 : 0, rotate: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Moon className="h-5 w-5 text-primary" />
              </motion.div>
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: theme === "dark" ? 1 : 0, rotate: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sun className="h-5 w-5 text-primary" />
              </motion.div>
            </div>
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden" onClick={() => setIsMenuOpen(false)}>
          <motion.div 
            className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-background p-8 ring-1 ring-zinc-900/5 dark:ring-zinc-800"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-row-reverse items-center justify-between">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md p-1 hover:bg-accent transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Navigation</span>
              </div>
            </div>
            <nav className="mt-6">
              <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        "block py-3 text-sm transition-colors relative",
                        item.href === '/app'
                          ? "my-2 px-4 py-2 rounded-full bg-primary hover:bg-primary/90 [&>*]:text-white dark:[&>*]:text-gray-800 inline-flex items-center gap-3 justify-center w-full"
                          : "hover:text-primary flex items-center gap-3",
                        location.pathname === item.href && item.href !== '/app'
                          ? "text-primary"
                          : item.href === '/app'
                            ? ""
                            : "text-muted-foreground"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      {item.name}
                      {item.href === '/app' && (
                        <motion.div
                          className="absolute -inset-[3px] bg-primary/20 rounded-full -z-10"
                          initial={false}
                          animate={{ 
                            scale: [1, 1.05, 1],
                            opacity: [0.2, 0.3, 0.2]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        </div>
      )}
    </header>
  );
};

export default Header;
