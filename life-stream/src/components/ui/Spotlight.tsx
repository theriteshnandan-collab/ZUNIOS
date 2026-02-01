"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface SpotlightContainerProps {
    children: React.ReactNode;
    className?: string;
    spotlightSize?: number;
    spotlightColor?: string;
}

/**
 * SpotlightContainer
 * 
 * A container that renders a radial gradient "spotlight" that follows the cursor.
 * Used for revealing texture and creating depth on hover.
 */
export function SpotlightContainer({
    children,
    className = "",
    spotlightSize = 600,
    spotlightColor = "rgba(255, 255, 255, 0.03)"
}: SpotlightContainerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Use springs for smooth, physical movement
    const springX = useSpring(mouseX, { stiffness: 400, damping: 30 });
    const springY = useSpring(mouseY, { stiffness: 400, damping: 30 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* The Spotlight Gradient */}
            <motion.div
                className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(${spotlightSize}px circle at var(--x) var(--y), ${spotlightColor}, transparent 80%)`,
                    // @ts-ignore - CSS custom properties
                    "--x": springX,
                    "--y": springY,
                    opacity: isHovered ? 1 : 0
                }}
            />
            {children}
        </div>
    );
}

/**
 * useCursorGlow Hook
 * 
 * Returns mouse position relative to an element for custom glow effects.
 */
export function useCursorGlow(ref: React.RefObject<HTMLElement>) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = element.getBoundingClientRect();
            setPosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        };

        const handleMouseEnter = () => setIsHovered(true);
        const handleMouseLeave = () => setIsHovered(false);

        element.addEventListener("mousemove", handleMouseMove);
        element.addEventListener("mouseenter", handleMouseEnter);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            element.removeEventListener("mousemove", handleMouseMove);
            element.removeEventListener("mouseenter", handleMouseEnter);
            element.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [ref]);

    return { position, isHovered };
}
