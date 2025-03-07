import * as math from 'mathjs';

interface Point {
  x: number;
  y: number;
}

export interface LineData {
  id: string;
  equation: string;
  color: string;
  points: Point[];
  error?: string;
}

// Parse and evaluate an equation
export const evaluateEquation = (
  equation: string, 
  xValues: number[]
): { points: Point[], error?: string } => {
  try {
    // Clean up the equation and make it x-centric
    const cleanEquation = prepareEquation(equation);
    
    if (!cleanEquation) {
      return { 
        points: [], 
        error: 'Cannot parse equation. Try using format like "2x + 1" or "x = 3"' 
      };
    }
    
    // Compile the expression
    const expression = math.compile(cleanEquation);
    
    // Evaluate for each x value
    const points = xValues.map(x => {
      try {
        const y = expression.evaluate({ x });
        return isNaN(y) ? null : { x, y };
      } catch (err) {
        return null;
      }
    }).filter((point): point is Point => point !== null);
    
    return { points };
  } catch (error) {
    console.error('Error evaluating equation:', error);
    return { 
      points: [], 
      error: 'Invalid equation. Please check your syntax.' 
    };
  }
};

// Helper function to prepare equation for evaluation
const prepareEquation = (equation: string): string => {
  let cleaned = equation.trim().toLowerCase();
  
  // Handle different equation formats
  if (cleaned.startsWith('y =') || cleaned.startsWith('y=')) {
    return cleaned.replace(/^y\s*=\s*/, '');
  }
  
  if (cleaned.includes('=')) {
    const [left, right] = cleaned.split('=').map(part => part.trim());
    
    // Handle x = constant case
    if (left === 'x') {
      const value = math.evaluate(right);
      return typeof value === 'number' ? `1000000 * (x - ${value})` : null;
    }
    
    // Handle y = expression case
    if (right === 'y') {
      return left;
    }
    
    // Handle general case
    if (!left.includes('y') && !right.includes('y')) {
      // Equation doesn't contain y, treat as x = constant
      try {
        const expr = `${left} - (${right})`;
        return `1000000 * (${expr})`;
      } catch (e) {
        return null;
      }
    }
    
    // Try to solve for y
    try {
      const expr = `${left} - (${right})`;
      return expr;
    } catch (e) {
      return null;
    }
  }
  
  // If no equals sign, assume it's an expression
  return cleaned;
};

// Replace ^ with ** for exponentiation and handle other conversions
export const formatEquation = (equation: string): string => {
  return equation.replace(/\^/g, '**');
};

// Find intersection points between two lines
export const findIntersections = (line1: LineData, line2: LineData): Point[] => {
  if (
    !line1?.points?.length || 
    !line2?.points?.length || 
    line1.error || 
    line2.error
  ) {
    return [];
  }
  
  const intersections: Point[] = [];

  // Simple segment intersection check
  for (let i = 0; i < line1.points.length - 1; i++) {
    for (let j = 0; j < line2.points.length - 1; j++) {
      const p1 = line1.points[i];
      const p2 = line1.points[i + 1];
      const p3 = line2.points[j];
      const p4 = line2.points[j + 1];
      
      // Find intersection of segments
      const intersection = segmentIntersection(p1, p2, p3, p4);
      if (intersection) {
        // Round to 2 decimal places for display
        intersection.x = Math.round(intersection.x * 100) / 100;
        intersection.y = Math.round(intersection.y * 100) / 100;
        
        // Avoid duplicates
        if (!intersections.some(p => 
          Math.abs(p.x - intersection.x) < 0.01 && 
          Math.abs(p.y - intersection.y) < 0.01)) {
          intersections.push(intersection);
        }
      }
    }
  }
  
  return intersections;
};

// Check if two line segments intersect
const segmentIntersection = (p1: Point, p2: Point, p3: Point, p4: Point): Point | null => {
  const d = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);
  
  if (d === 0) return null; // Parallel lines
  
  const a = ((p4.y - p3.y) * (p4.x - p1.x) - (p4.x - p3.x) * (p4.y - p1.y)) / d;
  const b = ((p2.y - p1.y) * (p4.x - p1.x) - (p2.x - p1.x) * (p4.y - p1.y)) / d;
  
  if (a >= 0 && a <= 1 && b >= 0 && b <= 1) {
    return {
      x: p1.x + a * (p2.x - p1.x),
      y: p1.y + a * (p2.y - p1.y)
    };
  }
  
  return null;
};

// Generate default x values for plotting
export const generateXValues = (min: number, max: number, steps: number): number[] => {
  const xValues: number[] = [];
  const step = (max - min) / steps;
  
  for (let i = 0; i <= steps; i++) {
    xValues.push(min + i * step);
  }
  
  return xValues;
};

// Default data range
export const DEFAULT_RANGE = {
  min: -10,
  max: 10,
  steps: 200
};

// Generate sample equations
export const SAMPLE_EQUATIONS = [
  { equation: "2*x + 3", name: "Linear (y = 2x + 3)" },
  { equation: "x^2", name: "Quadratic (y = x²)" },
  { equation: "sin(x)", name: "Sine (y = sin(x))" },
  { equation: "x^3 - 2*x", name: "Cubic (y = x³ - 2x)" },
  { equation: "sqrt(abs(x))", name: "Square Root (y = √|x|)" },
  { equation: "x = 5", name: "Vertical Line (x = 5)" },
  { equation: "y = 3", name: "Horizontal Line (y = 3)" },
  { equation: "x + y = 4", name: "Line (x + y = 4)" },
];
