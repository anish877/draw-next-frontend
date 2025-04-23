import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ChalkPathProps {
  path: string;
  delay?: number;
  className?: string;
  strokeWidth?: number;
}

const ChalkPath: React.FC<ChalkPathProps> = ({ 
  path, 
  delay = 0, 
  className,
  strokeWidth = 2
}) => {
  return (
    <path 
      d={path} 
      className={cn("chalk-stroke-path animate-chalk-draw", className)}
      style={{ 
        animationDelay: `${delay}s`,
        strokeDasharray: '100%',
        strokeDashoffset: '100%',
        strokeWidth: strokeWidth
      }}
    />
  );
};

interface ChalkDrawingProps {
  className?: string;
  darkMode?: boolean;
}

const ChalkDrawing: React.FC<ChalkDrawingProps> = ({ 
  className,
  darkMode = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const drawingRef = useRef<SVGSVGElement>(null);

  // Colors based on theme
  const strokeColor = darkMode ? "stroke-chalk-white" : "stroke-slate-700";
  const accentColor = "stroke-blue-500";
  const secondaryColor = darkMode ? "stroke-chalk-gray" : "stroke-slate-500";

  useEffect(() => {
    const drawing = drawingRef.current;
    
    if (!drawing) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    observer.observe(drawing);

    return () => {
      if (drawing) observer.unobserve(drawing);
    };
  }, []);

  return (
    <div className={cn("relative rounded-lg overflow-hidden", className)}>
      {/* Background for drawing area */}
      <div className={cn(
        "absolute inset-0 transition-colors duration-300",
        darkMode ? "bg-slate-900" : "bg-slate-100"
      )} />
      
      <svg 
        ref={drawingRef}
        className="w-full h-auto max-w-2xl mx-auto relative z-10" 
        viewBox="0 0 800 500" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {isVisible && (
          <>
            {/* Drawing board with shadow effect */}
            <rect 
              x="95" y="95" 
              width="610" height="310" 
              className={darkMode ? "fill-slate-800" : "fill-white"}
              rx="4"
            />
            <ChalkPath 
              path="M100,100 L700,100 L700,400 L100,400 Z" 
              className={cn(strokeColor, "opacity-90")} 
              delay={0.2}
              strokeWidth={3}
            />
            
            {/* Person 1 - More detailed */}
            <ChalkPath 
              path="M200,300 C230,250 270,270 250,350" 
              className={strokeColor} 
              delay={0.8}
            />
            <ChalkPath 
              path="M230,180 C260,180 250,220 230,220 C210,220 200,180 230,180" 
              className={strokeColor} 
              delay={1.1}
            />
            <ChalkPath 
              path="M230,220 L230,300" 
              className={strokeColor} 
              delay={1.4}
            />
            <ChalkPath 
              path="M230,250 L270,280" 
              className={strokeColor} 
              delay={1.7}
            />
            <ChalkPath 
              path="M230,250 L190,280" 
              className={strokeColor} 
              delay={2.0}
            />
            
            {/* Person 2 - More detailed */}
            <ChalkPath 
              path="M500,300 C530,250 570,270 550,350" 
              className={strokeColor} 
              delay={0.6}
            />
            <ChalkPath 
              path="M530,180 C560,180 550,220 530,220 C510,220 500,180 530,180" 
              className={strokeColor} 
              delay={0.9}
            />
            <ChalkPath 
              path="M530,220 L530,300" 
              className={strokeColor} 
              delay={1.2}
            />
            <ChalkPath 
              path="M530,250 L570,280" 
              className={strokeColor} 
              delay={1.5}
            />
            <ChalkPath 
              path="M530,250 L490,280" 
              className={strokeColor} 
              delay={1.8}
            />
            
            {/* Drawing on board - Enhanced with more elements */}
            <ChalkPath 
              path="M250,150 C350,120 450,180 550,150" 
              className={accentColor} 
              delay={2.3}
              strokeWidth={2.5}
            />
            <ChalkPath 
              path="M300,200 C350,180 400,220 450,200" 
              className={accentColor} 
              delay={2.6}
              strokeWidth={2.5}
            />
            <ChalkPath 
              path="M380,250 L380,320" 
              className={secondaryColor} 
              delay={2.9}
            />
            <ChalkPath 
              path="M350,280 L410,280" 
              className={secondaryColor} 
              delay={3.2}
            />
            
            {/* AI-generated drawing - Enhanced */}
            <ChalkPath 
              path="M480,220 C500,180 520,200 540,180" 
              className={cn(strokeColor, "opacity-90")} 
              delay={3.5}
            />
            <ChalkPath 
              path="M500,220 C520,240 530,220 550,240" 
              className={cn(strokeColor, "opacity-80")} 
              delay={3.8}
            />
            <ChalkPath 
              path="M150,220 C170,180 190,200 210,180" 
              className={cn(strokeColor, "opacity-80")} 
              delay={4.1}
            />
            <ChalkPath 
              path="M170,220 C190,240 200,220 220,240" 
              className={cn(strokeColor, "opacity-70")} 
              delay={4.4}
            />

            {/* Adding some decorative dots to represent chalk particles */}
            {[...Array(15)].map((_, i) => (
              <circle 
                key={`dot-${i}`}
                cx={150 + Math.random() * 500}
                cy={150 + Math.random() * 200}
                r={1 + Math.random() * 1.5}
                className={cn(
                  "animate-pulse",
                  i % 3 === 0 ? accentColor : secondaryColor,
                  "opacity-50"
                )}
                style={{
                  animationDelay: `${3 + Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}

            {/* Chat bubbles to show collaboration */}
            <ChalkPath 
              path="M280,160 C290,140 330,140 340,160 L340,190 L320,180 L330,200 L300,200 Z" 
              className={cn(secondaryColor, "opacity-70")} 
              delay={4.7}
              strokeWidth={1.5}
            />
            <ChalkPath 
              path="M460,160 C470,140 510,140 520,160 L520,190 L510,180 L520,200 L490,200 Z" 
              className={cn(secondaryColor, "opacity-70")} 
              delay={5.0}
              strokeWidth={1.5}
            />
          </>
        )}
      </svg>
    </div>
  );
};

export default ChalkDrawing;