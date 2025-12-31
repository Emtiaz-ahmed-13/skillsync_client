"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";

export const CardContainer = ({
  children,
  className,
  containerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [perspective, setPerspective] = useState(false);

  return (
    <div
      className={cn("flex items-center justify-center", containerClassName)}
      style={{
        perspective: "1000px",
      }}
    >
      <div
        ref={ref}
        onMouseEnter={() => setPerspective(true)}
        onMouseLeave={() => setPerspective(false)}
        className={cn(
          "relative transition-all duration-200 ease-linear",
          className
        )}
        style={{
          transform: perspective ? "scale(1)" : "scale(1)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const CardBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "h-96 w-96 rounded-[22px] border border-border bg-card shadow-lg",
        "dark:border-border dark:bg-background",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardItem = ({
  as: Tag = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  [key: string]: unknown;
}) => {
  const [transform, setTransform] = useState(
    `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`
  );

  const handleMouseEnter = () => {
    setTransform(
      `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
    );
  };

  const handleMouseLeave = () => {
    setTransform(
      `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`
    );
  };

  return (
    <Tag
      className={cn(
        "w-fit transition duration-300 ease-linear text-foreground",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
};
