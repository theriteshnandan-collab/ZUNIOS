"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * ZUNIOS PAGE TRANSITION CONTROLLER
 * 
 * Provides a cinematic "Neural Fade" transition between application modules.
 * This enhances the "Mind OS" feeling by making navigation feel like 
 * different layers of a single system.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
        transition={{ 
          duration: 0.6, 
          ease: [0.22, 1, 0.36, 1] // Custom "Premium" Cubic Bezier
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
