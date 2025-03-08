import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-70" />
      
      {/* Background Grid & Glitch Effects */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-1 opacity-20">
        {[...Array(144)].map((_, i) => (
          <div key={i} className="w-full h-full bg-gray-800 border border-gray-700 animate-pulse" />
        ))}
      </div>
      
      {/* 3D Styled Text */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 text-center text-white"
      >
        <h1 className="text-[10rem] font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-purple-500 drop-shadow-[0_0_25px_rgba(0,255,255,0.6)]">
          404
        </h1>
        <p className="text-2xl text-gray-300">Lost in the void of cyberspace...</p>
        
        {/* Glowing Button */}
        <motion.a
          href="/"
          className="mt-6 inline-block px-8 py-4 rounded-lg text-lg font-semibold text-black bg-gradient-to-r from-cyan-400 to-purple-500 shadow-lg hover:shadow-cyan-400/50 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Return to Reality
        </motion.a>
      </motion.div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-75"
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, scale: 0 }}
            animate={{ scale: [0, 1, 0.5, 1], opacity: [0, 1, 0], x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth], y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight] }}
            transition={{ duration: Math.random() * 5 + 2, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  );
};

export default NotFound;
