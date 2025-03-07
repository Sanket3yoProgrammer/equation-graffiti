import React from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChessKnight } from '@fortawesome/free-solid-svg-icons';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const About = () => {
  const links = [
    { 
      name: 'GitHub',
      url: 'https://github.com/sanket3yoprogrammer',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 fill-current">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      )
    },
    { 
      name: 'CodePen',
      url: 'https://codepen.io/Sanket-Kumar-Padhan-the-bold',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 fill-current">
          <path d="M24 8.182l-.018-.087-.017-.05c-.01-.024-.018-.05-.03-.075-.003-.018-.015-.034-.02-.05l-.035-.067-.03-.05-.044-.06-.046-.045-.06-.045-.046-.03-.06-.044-.044-.04-.015-.02L12.58.19c-.347-.232-.796-.232-1.142 0L.453 7.502l-.015.015-.044.035-.06.05-.038.04-.05.056-.037.045-.05.06c-.02.017-.03.03-.03.046l-.05.06-.02.06c-.02.01-.02.04-.03.07l-.01.05C0 8.12 0 8.15 0 8.18v7.497c0 .044.003.09.01.135l.01.046c.005.03.01.06.02.086l.015.05c.01.027.016.053.027.075l.022.05c0 .01.015.04.03.06l.03.04c.015.01.03.04.045.06l.03.04.04.04c.01.013.01.03.03.03l.06.042.04.03.01.014 10.97 7.33c.164.12.375.163.57.163s.39-.06.57-.18l10.99-7.28.014-.01.046-.037.06-.043.048-.036.052-.058.033-.045.04-.06.03-.05.03-.07.016-.052.03-.077.015-.045.03-.08v-7.5c0-.05 0-.095-.016-.14l-.014-.045.044.003zm-11.99 6.28l-3.65-2.44 3.65-2.442 3.65 2.44-3.65 2.44zm-1.216-6.18l-4.473 2.99L2.89 8.362l8.086-5.39V7.76zm-6.086 3.94l-2.27 1.52v-3.04l2.27 1.52zm.418 3.184l4.473 2.99v5.392L2.89 15.64l3.235-2.165zm6.634 2.99l4.474-2.98 3.236 2.164-8.086 5.39v-5.39zm6.492-3.89l2.27-1.52v3.04l-2.27-1.52zm-.419-3.184l-4.473-2.99V2.97l8.086 5.39-3.236 2.166z"/>
        </svg>
      )
    },
    { 
      name: 'Chess.com',
      url: 'https://chess.com/member/Sanket_Y07',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 fill-current">
          <path d="M12.5 2.7l3.3 8.9h.2l3.3-8.9h1.5l-4.2 11H16l-3.3-8.9h-.2L9.2 13.7h-.5l-4.2-11h1.5l3.3 8.9h.2l3.3-8.9h1.5zm-8.8 12c.3 0 .5.1.7.3.2.2.3.4.3.7 0 .3-.1.5-.3.7-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3-.2-.2-.3-.4-.3-.7 0-.3.1-.5.3-.7.2-.2.4-.3.7-.3zm16.6 0c.3 0 .5.1.7.3.2.2.3.4.3.7 0 .3-.1.5-.3.7-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3-.2-.2-.3-.4-.3-.7 0-.3.1-.5.3-.7.2-.2.4-.3.7-.3z"/>
        </svg>
      )
    },
    { 
      name: 'Portfolio',
      url: 'https://sanket3yoprogrammer.vercel.app',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 fill-current">
          <path d="M21.64 3.64a1.5 1.5 0 01.36.96v14.8a1.5 1.5 0 01-1.5 1.5h-18a1.5 1.5 0 01-1.5-1.5V4.6a1.5 1.5 0 011.5-1.5h18a1.5 1.5 0 011.14.54zM3 6.1v11.8a.5.5 0 00.5.5h16a.5.5 0 00.5-.5V6.1a.5.5 0 00-.5-.5h-16a.5.5 0 00-.5.5zm4.44 9.95a.75.75 0 01-.07-1.06l3.03-3.54-3.03-3.54a.75.75 0 011.13-.98l3.5 4.08a.75.75 0 010 .98l-3.5 4.08a.75.75 0 01-1.06-.02zm6.31-.95h3.5a.75.75 0 010 1.5h-3.5a.75.75 0 010-1.5z"/>
        </svg>
      )
    },
    { 
      name: 'Email',
      url: 'mailto:sanketkumarpadhan95@gmail.com',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2 fill-current">
          <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/>
          <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>
        </svg>
      )
    }
  ];

  const features = [
    { 
      title: 'Interactive Visualization',
      description: 'Transform mathematical equations into beautiful, interactive visual representations',
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6">
          <path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
        </svg>
      ),
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      title: 'Real-time Updates',
      description: 'See your equations come to life instantly as you type and modify parameters',
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6">
          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.31-.94-2.31-1.68 0-.86.79-1.46 2.1-1.46 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
        </svg>
      ),
      color: 'from-purple-500 to-pink-500'
    },
    { 
      title: 'Mathematical Precision',
      description: 'Accurate and precise plotting of complex mathematical functions',
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6">
          <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1.41 2L12 10.59 6.41 5H17.59zM5 19V7.83l6 6 6-6V19H5z"/>
        </svg>
      ),
      color: 'from-amber-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute w-full h-full">
          {[...Array(20)].map((_, i) => (
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
                opacity: [0, 0.2, 0.2, 0],
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
          rotate: [0, 90, 0],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 -right-40 w-[40rem] h-[40rem] bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          rotate: [0, -90, 0],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -bottom-40 -left-40 w-[50rem] h-[50rem] bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl"
      />

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 bg-grid-primary/[0.02] bg-[size:20px_20px] [mask-image:linear-gradient(to_bottom,transparent,80%,white)] pointer-events-none" />

      <Header />

      <main className="relative z-10 container mx-auto px-4 py-16">
        {/* About Card Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Creator Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-1000"></div>
            <div className="relative bg-background/80 backdrop-blur-xl rounded-xl border shadow-lg p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <motion.div 
                  className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/40 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.primary/0.2),transparent_70%)] group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary group-hover:scale-110 transition-transform duration-300">SP</span>
                  </div>
                </motion.div>
                
                <div className="flex-1 text-center md:text-left">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="inline-flex items-center px-4 py-2 rounded-full border bg-primary/10 backdrop-blur-sm mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <Compass className="w-4 h-4 mr-2 text-primary" />
                      <span className="text-sm font-medium">Creator & Developer</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Sanket Kumar Padhan</h1>
                    <p className="text-muted-foreground mb-4 group-hover:text-primary/80 transition-colors duration-300">
                      A passionate developer dedicated to making mathematics more accessible and engaging through intuitive visualization tools.
                    </p>
                  </motion.div>

                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    {links.map((link, index) => (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="group relative overflow-hidden hover:border-primary/50 transition-all duration-300"
                          asChild
                        >
                          <a 
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 relative z-10 px-4 py-2"
                          >
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <span className="relative z-10 transition-transform group-hover:scale-110 duration-300">
                                {link.icon}
                              </span>
                            </div>
                            <span className="relative z-10 font-medium group-hover:text-primary transition-colors duration-300">
                              {link.name}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 transform translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                          </a>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="relative group"
                whileHover={{ scale: 1.05 }}
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${feature.color} rounded-xl blur opacity-40 group-hover:opacity-50 transition duration-1000`}></div>
                <div className="relative h-full bg-background/80 backdrop-blur-sm rounded-lg border p-6 flex flex-col">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} bg-opacity-10 flex items-center justify-center mb-4 relative group-hover:scale-110 transition-transform duration-300`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/20 rounded-lg transform rotate-180 group-hover:rotate-0 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.primary/0.2),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10 text-primary group-hover:text-white transition-colors duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300 relative">
                    {feature.title}
                    <div className="absolute -inset-x-6 -inset-y-2 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </h3>
                  <p className="text-muted-foreground text-sm flex-1 relative z-10">{feature.description}</p>
                  <div className="absolute inset-0 bg-gradient-to-br from-background to-background rounded-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center relative group"
          >
            <div className="relative p-8">
              <motion.h2 
                className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary inline-block relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                Our Mission
              </motion.h2>
              <p className="text-muted-foreground max-w-2xl mx-auto group-hover:text-primary/80 transition-colors duration-300">
                To revolutionize mathematical education by providing powerful, intuitive tools that make complex equations accessible and engaging for everyone.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
