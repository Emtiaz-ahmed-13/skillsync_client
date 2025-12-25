"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SparkleProps {
  id: string;
  createdAt: number;
  color: string;
  size: number;
  style: {
    top: string;
    left: string;
  };
}

const DEFAULT_COLOR = "hsl(var(--primary))";

const generateSparkle = (color: string): SparkleProps => {
  return {
    id: String(Math.random()),
    createdAt: Date.now(),
    color,
    size: Math.random() * 10 + 10,
    style: {
      top: Math.random() * 100 + "%",
      left: Math.random() * 100 + "%",
    },
  };
};

export const SparklesCore = ({
  className,
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  particleDensity = 100,
  particleColor = DEFAULT_COLOR,
}: {
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
}) => {
  const [particles, setParticles] = useState<SparkleProps[]>([]);

  useEffect(() => {
    const initialParticles = Array.from({ length: particleDensity }, () =>
      generateSparkle(particleColor)
    );
    setParticles(initialParticles);

    const interval = setInterval(() => {
      setParticles((prev) => {
        const newParticle = generateSparkle(particleColor);
        const updated = [...prev.slice(1), newParticle];
        return updated;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [particleDensity, particleColor]);

  return (
    <div
      className={cn("absolute inset-0 overflow-hidden", className)}
      style={{ background }}
    >
      <AnimatePresence>
        {particles.map((sparkle) => (
          <motion.svg
            key={sparkle.id}
            className="absolute pointer-events-none"
            style={sparkle.style}
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180],
            }}
            exit={{ scale: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            width={sparkle.size * (minSize + Math.random() * (maxSize - minSize))}
            height={sparkle.size * (minSize + Math.random() * (maxSize - minSize))}
            viewBox="0 0 68 68"
            fill="none"
          >
            <path
              d="M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 35.7689 50.7555 42.5 43.5C50.0609 35.3684 68 34 68 34C68 34 49.0133 33.3684 42.5 25.5C35.3667 16.9163 34 0 34 0C34 0 32.7799 16.9163 26.5 25.5Z"
              fill={sparkle.color}
            />
          </motion.svg>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const Sparkles = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span className={cn("relative inline-block", className)}>
      <SparklesCore
        particleDensity={40}
        className="absolute inset-0 z-0"
        particleColor="hsl(var(--primary))"
      />
      <span className="relative z-10">{children}</span>
    </span>
  );
};
