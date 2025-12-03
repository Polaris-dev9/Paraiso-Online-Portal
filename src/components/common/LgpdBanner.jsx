import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const LgpdBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('ppo_cookie_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('ppo_cookie_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="fixed bottom-0 left-0 right-0 z-[2000] bg-gray-900/90 backdrop-blur-sm text-white p-4"
            >
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-start">
                        <Cookie className="mr-4 mt-1 flex-shrink-0" size={24} />
                        <p className="text-sm">
                            Nosso site utiliza cookies para garantir que você tenha a melhor experiência de navegação. Ao continuar, você concorda com o uso de cookies. Para mais informações, consulte nossa <Link to="/privacidade" className="font-bold underline hover:text-yellow-300">Política de Privacidade</Link>.
                        </p>
                    </div>
                    <Button
                        onClick={handleAccept}
                        className="gradient-gold text-white font-bold w-full md:w-auto flex-shrink-0"
                    >
                        Entendi e Aceito
                    </Button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LgpdBanner;