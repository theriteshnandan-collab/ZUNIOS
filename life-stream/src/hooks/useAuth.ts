"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const getLocalUser = (): User | null => {
        if (typeof window === "undefined") return null;
        try {
            const stored = localStorage.getItem("zunios_local_user");
            if (stored) {
                return JSON.parse(stored);
            }
        } catch {
            // Ignore parse errors
        }
        return null;
    };

    useEffect(() => {
        let isMounted = true;

        const checkUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (isMounted) {
                    if (user) {
                        setUser(user);
                    } else {
                        setUser(getLocalUser());
                    }
                }
            } catch (e) {
                console.error("Auth check failed", e);
                if (isMounted) {
                    setUser(getLocalUser());
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        checkUser();

        const handleAuthChange = () => {
            if (isMounted) {
                const local = getLocalUser();
                if (local) {
                    setUser(local);
                } else {
                    checkUser();
                }
            }
        };

        window.addEventListener("zunios-auth-change", handleAuthChange);

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (isMounted) {
                if (session?.user) {
                    setUser(session.user);
                } else {
                    setUser(getLocalUser());
                }
                setLoading(false);
            }
        });

        return () => {
            isMounted = false;
            window.removeEventListener("zunios-auth-change", handleAuthChange);
            subscription.unsubscribe();
        };
    }, []);

    return {
        user,
        loading,
        isSignedIn: !!user,
    };
}
