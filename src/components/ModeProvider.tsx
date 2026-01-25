"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EntryMode } from '@/lib/theme-config';

interface ModeContextType {
    mode: EntryMode;
    setMode: (mode: EntryMode) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<EntryMode>('thought');

    return (
        <ModeContext.Provider value={{ mode, setMode }}>
            {children}
        </ModeContext.Provider>
    );
}

export function useMode() {
    const context = useContext(ModeContext);
    if (context === undefined) {
        throw new Error('useMode must be used within a ModeProvider');
    }
    return context;
}
