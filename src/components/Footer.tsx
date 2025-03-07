
import React from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn("w-full py-4 px-6 border-t text-center text-sm text-muted-foreground backdrop-blur-sm", className)}>
      <p className="flex items-center justify-center gap-1">
        Made with 
        <span className="relative inline-block">
          <Heart className="w-4 h-4 text-red-500 animate-pulse" fill="#ff5757" />
          <span className="absolute -top-0 -right-0 size-4 bg-red-400/50 rounded-full blur-sm animate-pulse"></span>
        </span> 
        by{' '}
        <a 
          href="https://github.com/sanket3yoprogrammer" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          sanket3yoprogrammer
        </a>
      </p>
    </footer>
  );
};

export default Footer;
