import React from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

type AnimationType = 
  | "slide-in-left"
  | "slide-in-right"
  | "slide-in-up"
  | "fade-up"
  | "fade-in"
  | "scale-in";

interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  className?: string;
}

export function AnimatedSection({
  children,
  animation = "fade-up",
  delay = 0,
  className,
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation();

  const delayClass = delay > 0 ? `animation-delay-${delay}` : "";

  return (
    <div
      ref={ref}
      className={cn(
        isVisible ? `animate-${animation} ${delayClass}` : "opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}