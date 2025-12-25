"use client";

import { useEffect, useRef } from "react";

export function BackgroundRippleEffect() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create ripple effect elements
    const createRipple = () => {
      const ripple = document.createElement("div");
      ripple.className = "ripple";

      // Random position
      const size = Math.random() * 150 + 50;
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;

      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.backgroundColor = `rgba(100, 255, 218, ${
        Math.random() * 0.05
      })`;

      container.appendChild(ripple);

      // Remove ripple after animation
      setTimeout(() => {
        ripple.remove();
      }, 4000);
    };

    // Create initial ripples
    for (let i = 0; i < 3; i++) {
      setTimeout(createRipple, i * 1000);
    }

    // Create new ripples periodically
    const interval = setInterval(createRipple, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen w-full flex-col items-start justify-start overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--background) 0%, var(--secondary) 100%)",
      }}
    >
      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-none overflow-hidden"
      >
        <style jsx>{`
          .ripple {
            position: absolute;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: rippleAnimation 4s ease-out infinite;
            opacity: 0;
            backdrop-filter: blur(1px);
          }

          @keyframes rippleAnimation {
            0% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 0.1;
            }
            50% {
              opacity: 0.15;
            }
            100% {
              transform: translate(-50%, -50%) scale(2);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
