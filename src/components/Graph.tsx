import React, { useState, useRef, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceDot, ResponsiveContainer } from 'recharts';
import { ZoomIn, ZoomOut, RotateCcw, Move, Image, Save, CheckCircle, Share2, Download, Minimize, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LineData, DEFAULT_RANGE } from '@/utils/mathUtils';
import { motion, AnimatePresence } from 'framer-motion';
import debounce from 'lodash/debounce';
import { FaSave, FaCheckCircle  } from 'react-icons/fa';
// import { toast } from 'react-hot-toast';


import { openDB } from "idb"; 
import { toast, useToast } from './ui/use-toast';
import html2canvas from 'html2canvas';

interface GraphProps {
  lines: LineData[];
  intersections: { x: number; y: number }[];
  className?: string;
}

const Graph: React.FC<GraphProps> = ({ lines, intersections, className }) => {
  const [range, setRange] = useState({ min: DEFAULT_RANGE.min, max: DEFAULT_RANGE.max });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number } | null>(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const graphRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; points: { x: number; y: number; color: string }[] } | null>(null);
  const [dragAnimation, setDragAnimation] = useState({ x: 0, scale: 1 });
  const [animatedRange, setAnimatedRange] = useState({ min: DEFAULT_RANGE.min, max: DEFAULT_RANGE.max });
  const lastDragX = useRef(0);
  const [equations, setEquations] = useState([]);
  const [history, setHistory] = useState([]);
  const [savedEquations, setSavedEquations] = useState<{ id: number; equations: string[] }[]>([]);
  const roundToTwo = (num: number) => Math.round(num * 100) / 100;
  const [clicked, setClicked] = useState(false);
  const [animateKey, setAnimateKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

const graphContainerRef = useRef<HTMLDivElement>(null);

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    graphContainerRef.current?.requestFullscreen();
    setIsFullscreen(true);
  } else {
    document.exitFullscreen();
    setIsFullscreen(false);
  }
};

  useEffect(() => {
    const animate = () => {
      setAnimatedRange({
        min: range.min,
        max: range.max
      });
    };
    animate();
  }, [range]);

  useEffect(() => {
    const loadSavedEquations = async () => {
      const db = await openDB("GraphDB", 1, {
        upgrade(db) {
          db.createObjectStore("equations", { keyPath: "id", autoIncrement: true });
        },
      });

      const allEquations = await db.getAll("equations");
      setSavedEquations(allEquations);

      // toast.success("Equations saved successfully!");
    };
    loadSavedEquations();
  }, []);

  const processedLines = useMemo(() => {
    return lines.map(line => ({
      ...line,
      points: line.points.map(point => ({
        x: roundToTwo(point.x),
        y: roundToTwo(point.y)
      }))
    }));
  }, [lines]);

  const processedIntersections = useMemo(() => {
    return intersections.map(point => ({
      x: roundToTwo(point.x),
      y: roundToTwo(point.y)
    }));
  }, [intersections]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isPanning) return;
    e.preventDefault();
    setPanStart({ x: e.clientX, y: e.clientY });
    setDragAnimation(prev => ({ ...prev, scale: 0.998 }));
    if (graphRef.current) {
      graphRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || !panStart) return;
    e.preventDefault();

    const currentDragX = e.clientX - panStart.x;
    const smoothDragX = currentDragX * 0.6 + lastDragX.current * 0.4;
    lastDragX.current = smoothDragX;

    const dx = smoothDragX * 0.015;
    setPanOffset({ x: smoothDragX, y: e.clientY - panStart.y });
    setDragAnimation(prev => ({ ...prev, x: smoothDragX }));

    const newMin = roundToTwo(range.min - dx);
    const newMax = roundToTwo(range.max - dx);

    setRange({
      min: newMin,
      max: newMax
    });
  };

  const handleMouseUp = () => {
    if (!isPanning) return;
    setPanStart(null);
    setDragAnimation({ x: 0, scale: 1 });
    lastDragX.current = 0;
    if (graphRef.current) {
      graphRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseLeave = () => {
    if (!isPanning) return;
    setPanStart(null);
    setDragAnimation({ x: 0, scale: 1 });
    lastDragX.current = 0;
    if (graphRef.current) {
      graphRef.current.style.cursor = 'grab';
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isPanning) return;
    e.preventDefault();
    const touch = e.touches[0];
    setPanStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPanning || !panStart) return;
    e.preventDefault();
    const touch = e.touches[0];

    const dx = (touch.clientX - panStart.x) * 0.015;
    setPanOffset({ x: touch.clientX - panStart.x, y: touch.clientY - panStart.y });
    setDragAnimation(prev => ({ ...prev, x: touch.clientX - panStart.x }));

    const newMin = roundToTwo(range.min - dx);
    const newMax = roundToTwo(range.max - dx);

    setRange({
      min: newMin,
      max: newMax
    });
  };

  const handleTouchEnd = () => {
    if (!isPanning) return;
    setPanStart(null);
    setDragAnimation({ x: 0, scale: 1 });
  };

  const handleZoom = (factor: number) => {
    const center = roundToTwo((range.max + range.min) / 2);
    const span = roundToTwo((range.max - range.min) * factor);

    setRange({
      min: roundToTwo(center - span / 2),
      max: roundToTwo(center + span / 2)
    });
  };

  const handleReset = () => {
    setRange({ min: DEFAULT_RANGE.min, max: DEFAULT_RANGE.max });
    setPanOffset({ x: 0, y: 0 });
    setPanStart(null);
    setDragAnimation({ x: 0, scale: 1 });
  };

  // const saveEquations = async () => {
  //   const db = await openDB("GraphDB", 1);
  //   await db.add("equations", { equations: lines.map(line => line.equation), timestamp: Date.now() });
  //   const allEquations = await db.getAll("equations");
  //   setSavedEquations(allEquations);
  //   toast.success('Equations saved successfully!');
  // };
  

  const handleSaveClick = async () => {
    setClicked(true); // show tick
    setTimeout(() => setClicked(false), 1500); // Revert after 1.5s
  
    // Perform save logic
    const db = await openDB("GraphDB", 1);
    await db.add("equations", { equations: lines.map(line => line.equation), timestamp: Date.now() });
    const allEquations = await db.getAll("equations");
    setSavedEquations(allEquations);
    toast({
      title: "Equations Saved!",
      description: "Your equations have been successfully stored.",
      duration: 100,
      className: "bg-green-600 text-white border-0 shadow-lg",
      // icon: <CheckCircle className="text-white" />,
    });
  };


  const deleteEquationSet = async (id: number) => {
    const db = await openDB("GraphDB", 1);
    await db.delete("equations", id);
    const allEquations = await db.getAll("equations");
    setSavedEquations(allEquations);
  };

  const tooltipContent = useMemo(() => {
    if (!tooltipPosition) return null;
    return (
      <div className="bg-background/90 backdrop-blur-md border px-3 py-2 rounded-lg shadow-lg">
        {tooltipPosition.points.map((point, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: point.color }}
            />
            <p className="font-medium text-sm whitespace-nowrap">
              ({point.x}, {point.y})
            </p>
          </div>
        ))}
      </div>
    );
  }, [tooltipPosition]);

  const handleTooltip = (props: any) => {
    if (!props.active || !props.payload?.length) {
      setTooltipPosition(null);
      return null;
    }

    const x = roundToTwo(props.payload[0].payload.x);
    const points = props.payload.map((p: any) => ({
      x: roundToTwo(p.payload.x),
      y: roundToTwo(p.payload.y),
      color: p.color
    }));

    if (!tooltipPosition || tooltipPosition.points.length === 0 || !points.some(p => p.x === tooltipPosition.points[0]?.x)) {
      setTooltipPosition({ x, points });
    }

    return tooltipContent;
  };




  

  const captureGraph = async () => {
    const element = document.getElementById("graph-container");
    if (!element) return null;
  
    // Ensure element is fully resized in fullscreen before capturing
    await new Promise((resolve) => requestAnimationFrame(resolve));
  
    // If in fullscreen, temporarily adjust styles
    const isFullscreen = !!document.fullscreenElement;
    if (isFullscreen) {
      element.style.width = "100vw";
      element.style.height = "100vh";
    }
  
    // Capture with correct dimensions
    const canvas = await html2canvas(element, {
      useCORS: true, // Ensure external resources load
      backgroundColor: null, // Keeps transparency (optional)
      windowWidth: isFullscreen ? window.screen.width : element.scrollWidth,
      windowHeight: isFullscreen ? window.screen.height : element.scrollHeight,
      scale: 2, // Higher resolution capture
    });
  
    // Reset styles after capture
    if (isFullscreen) {
      element.style.width = "";
      element.style.height = "";
    }
  
    return canvas.toDataURL("image/png");
  };
  
  const ShareGraph = async (equations, intersectionPoints) => {
    // First, toggle fullscreen before proceeding
    toggleFullscreen();

    const imgURL = await captureGraph();
    if (!imgURL) return;

    const shareText = `
Equations:\n${equations.length ? equations.join("\n") : "No equations provided."}

Intersection Points:\n${
        intersectionPoints.length
            ? intersectionPoints.map(pt => `(${pt.x.toFixed(2)}, ${pt.y.toFixed(2)})`).join("\n")
            : "No intersection points."
    }

This Graph is generated using Sanket3yoprogrammer's tool EquationGraffiti!
`;

    if (navigator.share) {
        try {
            const blob = await (await fetch(imgURL)).blob();
            const file = new File([blob], "graph.png", { type: "image/png" });

            const shareData = {
              title: "Graph Image",
              text: `${shareText}\n\nCheck it out: https://equation-graffiti.vercel.app`,
              files: [file],
          };


            await navigator.share(shareData);
        } catch (error) {
            console.error("Sharing failed", error);
        }
    } else {
        navigator.clipboard.writeText(shareText);
        alert("Sharing is not supported. The image has been downloaded instead.");

        const link = document.createElement("a");
        link.href = imgURL;
        link.download = "graph.png";
        link.click();
    }
};

  
  const saveGraph = async () => {
    const imgURL = await captureGraph();
    if (!imgURL) return;
  
    const link = document.createElement("a");
    link.href = imgURL;
    link.download = "graph.png";
    link.click();
  };
  
  

  // const ShareGraph = async (equations: string[], intersectionPoints: { x: number, y: number }[]) => {
  //   const element = document.getElementById('graph-container');
  //   if (!element) return;
  
  //   const canvas = await html2canvas(element);
  //   const imgURL = canvas.toDataURL("image/png");
  
  //   // Generate equations text
  //   const equationsText = equations.length > 0 ? `Equations:\n${equations.join('\n')}` : "No equations provided.";
    
  //   // Generate intersection points text
  //   const intersectionsText = intersectionPoints.length > 0 
  //     ? `Intersection Points:\n${intersectionPoints.map(pt => `(${pt.x.toFixed(2)}, ${pt.y.toFixed(2)})`).join('\n')}`
  //     : "No intersection points.";
  
  //   const shareText = `${equationsText}\n\n${intersectionsText}\n\nThis Graph is generated using Sanket3yoprogrammer's tool EquationGraffiti! Check out the cool app: http://equation-graffiti.vercel.app`;
  
  //   // Check if Web Share API is supported
  //   if (navigator.share) {
  //     try {
  //       const blob = await (await fetch(imgURL)).blob();
  //       const file = new File([blob], "graph.png", { type: "image/png" });
  //       const equationsText = equations.length > 0 ? `Equations:\n${equations.join('\n')}` : "No equations provided.";
    
  //       // Generate intersection points text
  //       const intersectionsText = intersectionPoints.length > 0 
  //         ? `Intersection Points:\n${intersectionPoints.map(pt => `(${pt.x.toFixed(2)}, ${pt.y.toFixed(2)})`).join('\n')}`
  //         : "No intersection points.";
      
  //       const shareText = `${equationsText}\n\n${intersectionsText}\n\nThis Graph is generated using Sanket3yoprogrammer's tool EquationGraffiti! Check out the cool app: http://equation-graffiti.vercel.app`;
      
  //       navigator.clipboard.writeText(shareText);
  //       await navigator.share({
  //         files: [file],
  //         title: "Graph Image",
  //         text: shareText,
  //         url: "https://equation-graffiti.vercel.app",
  //       });
  //     } catch (error) {
  //       console.error("Sharing failed", error);
  //     }
  //   } else {
  //     navigator.clipboard.writeText(shareText);
  //     alert("Sharing is not supported on this device. Image has been downloaded instead.");
  //     // Create a temporary link for downloading
  //     const link = document.createElement("a");
  //     link.href = imgURL;
  //     link.download = "graph.png";
  //     link.click();
  //   }
  // };

  // const saveGraph = async (equations: string[], intersectionPoints: { x: number, y: number }[]) => {
  //   const element = document.getElementById('graph-container');
  //   if (!element) return;
  
  //   const canvas = await html2canvas(element);
  //   const imgURL = canvas.toDataURL("image/png");

  //   // Create a temporary link for downloading
  //   const link = document.createElement("a");
  //   link.href = imgURL;
  //   link.download = "graph.png";
  //   link.click();

  // };


  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();

    if (isPanning && graphRef.current) {
      graphRef.current.addEventListener('selectstart', preventDefault);
      document.body.style.userSelect = 'none';
    }

    return () => {
      if (graphRef.current) {
        graphRef.current.removeEventListener('selectstart', preventDefault);
        document.body.style.userSelect = '';
      }
    };
  }, [isPanning]);

  return (
    <div className={cn("w-full h-full flex flex-col space-y-4 relative bg-background", className)}  id="graph-container" ref={graphContainerRef} >
      
      <div className="flex items-center justify-center">
        <div className="text-sm font-medium">Graph</div> </div>
        <div className="flex items-center justify-center">
        <div className="flex items-center space-x-2 rounded-xl bg-gray-600/10 p-4 pt-1 pb-1">
        {/* <Button
            variant="ghost"
            size="icon"
            onClick={saveEquations}
            className="h-8 w-8"
          >
            <FaSave className="h-4 w-4" />
            <span className="sr-only">Save equations</span>
          </Button> */}

            <motion.div whileTap={{ scale: 0.9, y: 2 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => ShareGraph(
                lines.map(line => line.equation), 
                intersections
              )}
              className="h-8 w-8"
            >
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share Graph</span>
            </Button>
          </motion.div>

          <motion.div whileTap={{ scale: 0.9, y: 2 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={saveGraph}
              className="h-8 w-8"
            >
              <Download className="h-4 w-4" />
              <span className="sr-only">Save Image</span>
            </Button>
          </motion.div>
          
          <Button
          variant="ghost"
          size="icon"
          onClick={handleSaveClick}
          className="h-8 w-8"
        >
          <motion.div
            key={clicked ? "clicked" : "default"}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {clicked ? (
              <FaCheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Save className="h-4 w-4" />
            )}
          </motion.div>
          <span className="sr-only">Save equations</span>
        </Button>
        <Button 
          onClick={toggleFullscreen} 
          className="absolute top-1 size-30 right-1 bg-blue-500 text-white p-2 rounded-md shadow-md hover:bg-gray-700/40"
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPanning(!isPanning)}
            className={cn("h-8 w-8 transition-colors", isPanning && "bg-accent text-accent-foreground")}
          >
            <Move className="h-4 w-4" />
            <span className="sr-only">Toggle pan mode</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleZoom(0.5)}
            className="h-8 w-8"
          >
            <ZoomIn className="h-4 w-4" />
            <span className="sr-only">Zoom in</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleZoom(2)}
            className="h-8 w-8"
          >
            <ZoomOut className="h-4 w-4" />
            <span className="sr-only">Zoom out</span>
          </Button>


          
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setAnimateKey((prev) => prev + 1); // Re-trigger animation
                handleReset(); // function
              }}
              
              className="h-8 w-8"
            > 
            <motion.div
            key={animateKey} // Changing the key forces re-animation
            animate={{ rotate: 360 }}
            transition={{ duration: 0.5, ease: "linear" }}
            >
              <RotateCcw className="h-4 w-4" />
              <span className="sr-only">Reset view</span>
              </motion.div>
              </Button>
          
              </div>
        </div>
        
      

      <motion.div
        ref={graphRef}
        className="flex-1 relative w-full h-3/5 min-h-[300px] bg-card rounded-xl border overflow-hidden shadow-sm transition-all"
        style={{ 
          cursor: isPanning ? (panStart ? 'grabbing' : 'grab') : 'default',
          touchAction: isPanning ? 'none' : 'auto',
          userSelect: 'none'
        }}
        animate={dragAnimation}
        transition={{ 
          x: { 
            type: "spring", 
            stiffness: 50,
            damping: 20,
            mass: 1,
            restDelta: 0.001
          },
          scale: { 
            type: "spring", 
            stiffness: 120, 
            damping: 20 
          }
        }}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.01}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <ResponsiveContainer width="100%" height="100%" className="animate-fade-in">
          <LineChart
            data={[...Array(200)].map((_, i) => {
              const x = roundToTwo(animatedRange.min + (i * (animatedRange.max - animatedRange.min)) / 199);
              return {
                x,
                ...processedLines.reduce((acc, line) => {
                  const matchingPoint = line.points.find(p => roundToTwo(p.x) === x);
                  if (matchingPoint) {
                    acc[line.id] = matchingPoint.y;
                  }
                  return acc;
                }, {} as Record<string, number>)
              };
            })}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
            <XAxis 
              dataKey="x" 
              type="number" 
              domain={[animatedRange.min, animatedRange.max]} 
              tickCount={11}
              tickFormatter={roundToTwo}
              allowDataOverflow 
              className="text-xs"
            />
            <YAxis 
              domain={[animatedRange.min, animatedRange.max]} 
              tickCount={11}
              tickFormatter={roundToTwo}
              allowDataOverflow 
              className="text-xs"
            />
            <Tooltip 
              content={handleTooltip}
              isAnimationActive={false}
            />

            {processedLines.map((line, index) => {
              const lineProps = {
                type: "monotone",
                data: line.points,
                dataKey: "y",
                stroke: line.color,
                dot: false,
                connectNulls: true,
                strokeWidth: 2,
                isAnimationActive: false,
                activeDot: ({ cx, cy, stroke }: any) => (
                  <motion.g>
                    <motion.circle
                      cx={cx}
                      cy={cy}
                      r={5}
                      fill="white"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1,
                      }}
                      transition={{ 
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        mass: 0.5
                      }}
                    />
                    <motion.circle
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill={line.color}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1,
                      }}
                      transition={{ 
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        mass: 0.5
                      }}
                    />
                  </motion.g>
                ),
                onMouseEnter: (data: any) => {
                  if (data && data.activePayload) {
                    const element = data.activePayload[0].payload;
                    console.log("Hover point:", element);
                  }
                }
              };

              return (
                <Line key={line.id || index} {...lineProps} />
              );
            })}

            {processedIntersections.map((point, index) => (
              <ReferenceDot
                key={index}
                x={point.x}
                y={point.y}
                r={4}
                fill="currentColor"
                className="animate-pulse"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
      {processedIntersections.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-md border p-4 rounded-xl shadow-lg z-10"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium mr-4">Intersections</div>
            <div className="text-xs text-muted-foreground">{processedIntersections.length} points</div>
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {processedIntersections.map((point, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>({point.x}, {point.y})</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Graph;
