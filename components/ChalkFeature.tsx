import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ChalkFeatureProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
  className?: string;
  index?: number;
  darkMode?: boolean;
}

const ChalkFeature: React.FC<ChalkFeatureProps> = ({
  icon: Icon,
  title,
  description,
  iconColor = 'text-blue-600',
  className,
  index = 0,
  darkMode = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const featureRef = useRef<HTMLDivElement>(null);

  // Set text colors based on theme
  const titleColor = darkMode ? "text-white" : "text-slate-800";
  const descriptionColor = darkMode ? "text-slate-300" : "text-slate-600";

  useEffect(() => {
    const feature = featureRef.current;
    
    if (!feature) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, index * 150);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '20px',
      }
    );

    observer.observe(feature);

    return () => {
      if (feature) observer.unobserve(feature);
    };
  }, [index]);

  return (
    <div
      ref={featureRef}
      className={cn(
        'chalk-feature relative transition-all duration-300',
        isVisible ? 'animate-chalk-fade-in' : 'opacity-0 translate-y-4',
        className
      )}
      style={{
        animationDelay: `${index * 0.15}s`,
        animationFillMode: 'forwards'
      }}
    >
      {/* Feature content wrapper */}
      <div className="flex flex-col h-full">
        {/* Icon with background */}
        {Icon && (
          <div className="mb-5 relative">
            <div className={cn(
              "w-12 h-12 flex items-center justify-center rounded-lg",
              darkMode ? "bg-slate-800" : "bg-slate-100"
            )}>
              <Icon 
                className={cn("w-6 h-6", iconColor)} 
                strokeWidth={2} 
                aria-hidden="true"
              />
            </div>
          </div>
        )}
        
        {/* Feature title with animated underline on hover */}
        <h3 className={cn(
          "font-medium text-xl mb-3 relative inline-block",
          titleColor
        )}>
          {title}
          <span className={cn(
            "absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full",
            darkMode ? "bg-blue-400" : "bg-blue-500"
          )}></span>
        </h3>
        
        {/* Feature description */}
        <p className={cn(
          "font-normal leading-relaxed",
          descriptionColor
        )}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default ChalkFeature;