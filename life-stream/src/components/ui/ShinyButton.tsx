"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShinyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    icon?: React.ReactNode;
}

export const ShinyButton = ({
    children,
    className,
    icon,
    ...props
}: ShinyButtonProps) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "relative rounded-xl px-6 py-3 font-medium transition-all outline-none overflow-hidden group",
                "bg-neutral-900 border border-white/10 text-neutral-200",
                "hover:text-white hover:border-white/20",
                className
            )}
            {...props}
        >
            {/* The Liquid Shine Effect */}
            <span className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                <span className="absolute -inset-[100%] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1)_0%,transparent_60%)] group-hover:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2)_0%,transparent_60%)] transition-all duration-500" />
                <span className="absolute -top-[100%] left-[50%] -translate-x-[50%] w-[200%] h-[200%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0)_100%)] rotate-45 translate-y-[100%] group-hover:translate-y-[-100%] transition-transform duration-1000 ease-in-out" />
            </span>

            {/* Button Content */}
            <span className="relative z-10 flex items-center justify-center gap-2">
                {icon && <span className="text-white/70 group-hover:text-white transition-colors">{icon}</span>}
                {children}
            </span>

            {/* Bottom Glow (Cyberpunk style) */}
            <span className="absolute bottom-0 left-[10%] w-[80%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.button>
    );
};
