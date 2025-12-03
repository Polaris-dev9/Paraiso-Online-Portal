import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const IDLE_TIMEOUT = 20 * 60 * 1000; // 20 minutes

export const useIdleTimeout = () => {
    const { user: adminUser, logout: adminLogout } = useAuth();
    const { user: supabaseUser, signOut: supabaseSignOut } = useSupabaseAuth();
    const { toast } = useToast();
    const timeoutId = useRef(null);

    const user = adminUser || supabaseUser;
    const logout = adminUser ? adminLogout : supabaseSignOut;

    const resetTimeout = () => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }
        if (user) {
            timeoutId.current = setTimeout(() => {
                toast({
                    title: "Sessão Expirada",
                    description: "Você foi desconectado por inatividade.",
                    variant: "destructive",
                });
                logout();
            }, IDLE_TIMEOUT);
        }
    };

    useEffect(() => {
        const events = ['mousemove', 'keydown', 'scroll', 'click'];

        const eventListener = () => {
            resetTimeout();
        };

        if (user) {
            events.forEach(event => {
                window.addEventListener(event, eventListener);
            });
            resetTimeout();
        }

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, eventListener);
            });
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
        };
    }, [user, logout, toast]);

    return null;
};