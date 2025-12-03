import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

const AdminHeader = ({ title }) => {
    const { logout: adminLogout } = useAuth();
    const { signOut: supabaseSignOut } = useSupabaseAuth();

    const handleLogout = () => {
        adminLogout();
        supabaseSignOut();
    };

    return (
        <header className="bg-gray-800 text-white p-4 shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">{title || 'Painel Administrativo'}</h1>
                <div className="flex items-center gap-4">
                    <Link to="/" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-gray-800">
                            <Home className="mr-2 h-4 w-4" />
                            Ver Portal
                        </Button>
                    </Link>
                    <Button onClick={handleLogout} variant="destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;