import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black relative">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-70" />

      {/* Sci-Fi Styled Smooth Rotating Rings */}
      <div className="relative flex items-center justify-center">
        <motion.div
          className="absolute w-32 h-32 border-8 border-transparent border-t-cyan-400 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2.8, ease: "linear" }}
        />
        <motion.div
          className="absolute w-24 h-24 border-8 border-transparent border-b-purple-500 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 3.2, ease: "linear" }}
        />
        <motion.div
          className="absolute w-16 h-16 border-8 border-transparent border-l-blue-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3.6, ease: "linear" }}
        />
      </div>
    </div>
  );
};

export default Loader;
