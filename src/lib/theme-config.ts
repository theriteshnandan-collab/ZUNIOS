// Internal keys remain the same for database compatibility
export type EntryMode = 'dream' | 'idea' | 'win' | 'journal' | 'thought';

// Display labels for the UI
export const MODE_LABELS: Record<EntryMode, { name: string; tagline: string; icon: string }> = {
    dream: {
        name: "Vision",
        tagline: "What did you see? Dreams, visions, imagination",
        icon: "🌙"
    },
    idea: {
        name: "Build",
        tagline: "What will you create? Projects, ideas, plans",
        icon: "⚡"
    },
    win: {
        name: "Log",
        tagline: "What happened? Wins, lessons, events",
        icon: "🎯"
    },
    journal: {
        name: "Think",
        tagline: "What's on your mind? Thoughts, questions",
        icon: "🧠"
    },
    thought: {
        name: "Think",
        tagline: "What's on your mind? Thoughts, questions",
        icon: "🧠"
    }
};

export interface ThemePalette {
    primary: string;
    blobs: {
        one: string;
        two: string;
        three: string;
    };
    icon: string;
}

// BLOBS: Ultra-subtle (5% opacity) to blend perfectly with the void background
export const THEMES: Record<EntryMode, ThemePalette> = {
    dream: {
        primary: "from-purple-400 to-indigo-400",
        blobs: {
            one: "bg-purple-950/5",
            two: "bg-indigo-950/5",
            three: "bg-blue-950/5"
        },
        icon: "text-purple-400"
    },
    idea: {
        primary: "from-amber-300 to-yellow-400",
        blobs: {
            one: "bg-amber-950/5",
            two: "bg-orange-950/5",
            three: "bg-yellow-950/5"
        },
        icon: "text-amber-400"
    },
    win: {
        primary: "from-emerald-400 to-teal-400",
        blobs: {
            one: "bg-emerald-950/5",
            two: "bg-teal-950/5",
            three: "bg-green-950/5"
        },
        icon: "text-emerald-400"
    },
    journal: {
        primary: "from-blue-400 to-cyan-400",
        blobs: {
            one: "bg-blue-950/5",
            two: "bg-cyan-950/5",
            three: "bg-slate-950/5"
        },
        icon: "text-blue-400"
    },
    thought: {
        primary: "from-white to-zinc-400",
        blobs: {
            one: "bg-zinc-950/5",
            two: "bg-slate-950/5",
            three: "bg-gray-950/5"
        },
        icon: "text-white"
    }
};
