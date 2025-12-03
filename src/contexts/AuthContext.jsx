import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({
        maintenanceMode: false,
        googleLoginEnabled: true,
    });

    const logToAudit = async (action, details = {}) => {
        if (!user) return;
        try {
            const { error } = await supabase.from('audit_log').insert([{
                user_id: null,
                action,
                details: { ...details, admin_email: user.email }
            }]);
            if (error) {
                console.error('Error logging to audit table:', error);
            }
        } catch (e) {
            console.error('Exception while logging to audit table:', e);
        }
    };

    useEffect(() => {
        try {
            const storedUser = sessionStorage.getItem('ppo_user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            const storedSettings = localStorage.getItem('ppo_settings');
            if (storedSettings) {
                setSettings(JSON.parse(storedSettings));
            }
        } catch (error) {
            console.error("Failed to parse data from storage", error);
            sessionStorage.removeItem('ppo_user');
            localStorage.removeItem('ppo_settings');
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        let userData = null;
        if (email === 'master@portalparaisoonline.com.br' && password === '@@321adm') {
            userData = { email, role: 'master' };
        } else if (email === 'admin@portalparaisoonline.com.br' && password === '@32157') {
            userData = { email, role: 'general_admin' };
        } else if (email === 'conteudo@portalparaisoonline.com.br' && password === 'conteudo#24') {
            userData = { email, role: 'content_admin' };
        } else if (email === 'franquia@portalparaisoonline.com.br' && password === 'franquia@123') {
            userData = { email, role: 'franchisee' };
        }

        if (userData) {
            setUser(userData);
            sessionStorage.setItem('ppo_user', JSON.stringify(userData));
            logToAudit('admin_login_success', { email });
        } else {
            logToAudit('admin_login_failed', { email });
        }
        
        return userData;
    };

    const logout = () => {
        logToAudit('admin_logout', { email: user?.email });
        setUser(null);
        sessionStorage.removeItem('ppo_user');
    };

    const updateSettings = (newSettings) => {
        setSettings(newSettings);
        localStorage.setItem('ppo_settings', JSON.stringify(newSettings));
    };

    const value = { user, login, logout, loading, settings, updateSettings };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};