"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const easeOutExpo = [0.21, 0.47, 0.32, 0.98] as const;

interface RevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: "up" | "down" | "left" | "right";
  once?: boolean;
  className?: string;
}

export function Reveal({
  children,
  delay = 0,
  duration = 0.7,
  distance = 32,
  direction = "up",
  once = true,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  const offset = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  }[direction];

  const hidden = prefersReducedMotion
    ? { opacity: 0 }
    : { opacity: 0, ...offset };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={hidden}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : hidden}
      transition={{ duration, delay, ease: easeOutExpo }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerRevealProps {
  children: ReactNode[];
  className?: string;
  childClassName?: string;
  staggerDelay?: number;
}

export function StaggerReveal({
  children,
  className,
  childClassName,
  staggerDelay = 0.12,
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children.map((child, i) => (
        <motion.div
          key={i}
          className={childClassName}
          variants={{
            hidden: { opacity: 0, y: 32 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.7, ease: easeOutExpo },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

interface FloatingImageProps {
  src: string;
  alt: string;
  className?: string;
  duration?: number;
  distance?: number;
}

export function FloatingImage({
  src,
  alt,
  className,
  duration = 6,
  distance = 8,
}: FloatingImageProps) {
  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      animate={{ y: [0, -distance, 0] }}
      transition={{ repeat: Infinity, duration, ease: "easeInOut" }}
    />
  );
}
