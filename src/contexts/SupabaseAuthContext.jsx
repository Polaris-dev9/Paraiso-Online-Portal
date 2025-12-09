import React, { createContext, useState, useEffect, useContext } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';

    const SupabaseAuthContext = createContext();

    export const SupabaseAuthProvider = ({ children }) => {
        const [user, setUser] = useState(null);
        const [loading, setLoading] = useState(true);

        const logToAudit = async (action, details = {}, userIdOverride = null) => {
            try {
                const userId = userIdOverride || (user ? user.id : null);
                if (!userId) return; // Don't log if there is no user ID
                const { error } = await supabase.from('audit_log').insert([{
                    user_id: userId,
                    action,
                    details
                }]);
                if (error) {
                    console.error('Error logging to audit table:', error);
                }
            } catch (e) {
                console.error('Exception while logging to audit table:', e);
            }
        };

        useEffect(() => {
            let mounted = true;

            const getSession = async () => {
                try {
                    const { data: { session }, error } = await supabase.auth.getSession();
                    if (error) {
                        console.error("[SupabaseAuth] Error getting session:", error);
                        if (mounted) {
                            setUser(null);
                            setLoading(false);
                        }
                        return;
                    }
                    
                    console.log("[SupabaseAuth] Session retrieved:", {
                        hasSession: !!session,
                        hasUser: !!session?.user,
                        userEmail: session?.user?.email,
                        userId: session?.user?.id,
                        userObject: session?.user ? {
                            id: session.user.id,
                            email: session.user.email,
                            aud: session.user.aud,
                            role: session.user.role
                        } : null
                    });

                    if (mounted) {
                        const userToSet = session?.user ?? null;
                        console.log("[SupabaseAuth] Setting user from getSession:", userToSet ? userToSet.email : 'null');
                        setUser(userToSet);
                        setLoading(false);
                        
                        // Se encontrou uma sessão, garantir que o estado está atualizado
                        // O onAuthStateChange pode não disparar se a sessão já existia
                        if (session?.user) {
                            // Pequeno delay para garantir que o estado foi atualizado
                            setTimeout(() => {
                                if (mounted) {
                                    console.log("[SupabaseAuth] Ensuring user state is set after getSession");
                                    setUser(session.user);
                                }
                            }, 100);
                        }
                    }
                } catch (err) {
                    console.error("[SupabaseAuth] Exception getting session:", err);
                    if (mounted) {
                        setUser(null);
                        setLoading(false);
                    }
                }
            };

            // Configurar listener ANTES de buscar a sessão para garantir que captura todos os eventos
            const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
                console.log("[SupabaseAuth] Auth state changed:", {
                    event,
                    hasSession: !!session,
                    hasUser: !!session?.user,
                    userEmail: session?.user?.email,
                    userId: session?.user?.id,
                    userObject: session?.user ? {
                        id: session.user.id,
                        email: session.user.email,
                        aud: session.user.aud,
                        role: session.user.role
                    } : null,
                    mounted
                });

                const currentUser = session?.user ?? null;
                if (mounted) {
                    console.log("[SupabaseAuth] Setting user in context:", currentUser ? currentUser.email : 'null');
                    setUser(currentUser);
                    setLoading(false);
                }
                
                if (event === 'SIGNED_IN') {
                    await logToAudit('user_signed_in', {}, currentUser?.id);
                }
                if (event === 'SIGNED_OUT') {
                    // When signing out, the user object might be null, so we need to capture it before it's gone.
                    // However, onAuthStateChange for SIGNED_OUT might not provide the user details reliably.
                    // This log is better handled just before calling signOut.
                }
            });

            // Buscar sessão DEPOIS de configurar o listener
            getSession();

            return () => {
                mounted = false;
                if (authListener?.subscription) {
                    authListener.subscription.unsubscribe();
                }
            };
        }, []);

        const signInWithPassword = async (email, password) => {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                await logToAudit('login_failed', { email, error: error.message });
            }
            return { data, error };
        };

        const signUp = async (email, password, metadata = {}) => {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: metadata,
                    emailRedirectTo: `${window.location.origin}/subscriber-area`
                }
            });
            if (error) {
                await logToAudit('signup_failed', { email, error: error.message });
            } else if (data?.user) {
                await logToAudit('user_signed_up', { email, userId: data.user.id });
            }
            return { data, error };
        };

        const resendConfirmationEmail = async (email) => {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email
            });
            if (error) {
                console.error('Error resending confirmation email:', error);
            }
            return { error };
        };

        const signInWithGoogle = async () => {
            // Usar o domínio atual (localhost em dev, produção em prod)
            const currentOrigin = window.location.origin;
            const redirectTo = `${currentOrigin}/subscriber-area`;
            
            console.log('[SupabaseAuth] ===== GOOGLE LOGIN START =====');
            console.log('[SupabaseAuth] Current URL:', window.location.href);
            console.log('[SupabaseAuth] Current origin:', currentOrigin);
            console.log('[SupabaseAuth] RedirectTo URL:', redirectTo);
            console.log('[SupabaseAuth] Is localhost?', currentOrigin.includes('localhost'));
            
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectTo,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    }
                }
            });
            
            if (error) {
                console.error('[SupabaseAuth] OAuth Error:', error);
                await logToAudit('google_login_failed', { error: error.message });
                throw new Error(error.message);
            }
            
            console.log('[SupabaseAuth] OAuth Data:', data);
            console.log('[SupabaseAuth] ===== GOOGLE LOGIN END =====');
        };

        const resetPasswordForEmail = async (email) => {
            console.log('[SupabaseAuth] resetPasswordForEmail called with email:', email);
            console.log('[SupabaseAuth] redirectTo will be:', `${window.location.origin}/reset-password`);
            
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
                // Adicionar opções adicionais para garantir que o email seja enviado
                captchaToken: undefined, // Não usar captcha por enquanto
            });
            
            if (error) {
                console.error('[SupabaseAuth] Error sending password reset email:', {
                    message: error.message,
                    status: error.status,
                    code: error.code,
                    name: error.name,
                    error: error
                });
            } else {
                console.log('[SupabaseAuth] Password reset email sent successfully:', data);
            }
            
            return { data, error };
        };

        const signOut = async () => {
            const userIdBeforeSignOut = user?.id;
            if (userIdBeforeSignOut) {
                await logToAudit('user_signed_out', {}, userIdBeforeSignOut);
            }
            await supabase.auth.signOut();
            setUser(null);
        };

        const value = {
            user,
            loading,
            signInWithPassword,
            signInWithGoogle,
            signUp,
            signOut,
            resendConfirmationEmail,
            resetPasswordForEmail,
        };

        return <SupabaseAuthContext.Provider value={value}>{children}</SupabaseAuthContext.Provider>;
    };

    export const useSupabaseAuth = () => {
        const context = useContext(SupabaseAuthContext);
        if (context === undefined) {
            throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
        }
        return context;
    };