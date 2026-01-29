import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
    gradient?: boolean;
    glow?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, gradient = false, glow = false, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    // Base glass effect
                    "relative overflow-hidden rounded-2xl",
                    "border border-white/5 bg-white/5 backdrop-blur-xl", // Reduced border opacity, moving to specular ring
                    // Smooth transitions
                    "transition-all duration-300 ease-out",
                    // Hover effects
                    "hover:bg-white/[0.08]",
                    "hover:shadow-2xl hover:shadow-purple-500/10",
                    "hover:-translate-y-0.5",
                    // Active Physics (Brick 4)
                    "active:scale-[0.98] active:duration-100",
                    // Specular Highlight (Inner Ring 1px)
                    "after:absolute after:inset-0 after:rounded-2xl after:border after:border-white/10 after:pointer-events-none",
                    // Group for child animations
                    "group",
                    className
                )}
                {...props}
            >
                {/* Inner glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Noise Texture */}
                <div
                    className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay z-0"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />

                {/* Gradient Border Glow (optional) */}
                {gradient && (
                    <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-500/30 via-primary/30 to-indigo-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
                )}

                {/* Persistent Glow (optional) */}
                {glow && (
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur-xl -z-10" />
                )}

                {/* Content */}
                <div className="relative z-10 h-full">
                    {children}
                </div>
            </div>
        );
    }
);
GlassCard.displayName = "GlassCard";

export { GlassCard };
