import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Home, Building2, Newspaper, Calendar, Briefcase, FileText, ShoppingCart, BarChart3, Info, Building, User2 as UserTie, Megaphone, Crown, Search, Rss, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = e.target.elements.search.value;
    if (!searchTerm) return;
    toast({
        title: "🔍 Buscando...",
        description: `Buscando por "${searchTerm}". Funcionalidade em desenvolvimento.`,
    });
  };

  const navItems = [
    { name: 'Início', path: '/', icon: Home },
    { name: 'Guia Comercial', path: '/guia-comercial', icon: Building2 },
    { name: 'Guia Profissional', path: '/guia-profissional', icon: UserTie },
    { name: 'Notícias', path: '/noticias', icon: Newspaper },
    { name: 'Eventos', path: '/eventos', icon: Calendar },
    { name: 'Empregos', path: '/empregos', icon: Briefcase },
    { name: 'Currículos', path: '/curriculos', icon: FileText },
    { name: 'Blog', path: '/blog', icon: Rss },
    { name: 'Rankings', path: '/rankings', icon: BarChart3 },
    { name: 'Utilidades', path: '/utilidades', icon: Info },
    { name: 'A Cidade', path: '/cidade', icon: Building },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="bg-blue-900 text-white text-xs py-1">
        <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <a href="tel:38998085771" className="flex items-center hover:text-yellow-300 transition-colors">
                    <Phone size={12} className="mr-1.5"/> <span>(38) 99808-5771</span>
                </a>
                <a href="mailto:contato@portalparaisoonline.com.br" className="hidden sm:flex items-center hover:text-yellow-300 transition-colors">
                    <Mail size={12} className="mr-1.5"/> <span>contato@portalparaisoonline.com.br</span>
                </a>
            </div>
            <div className="flex-grow text-center hidden lg:block">
                <p className="font-semibold">O portal que conecta São João do Paraíso!</p>
            </div>
            <div className="w-auto"></div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
              <div className="w-12 h-12 gradient-royal rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">PPO</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold text-blue-900">Portal Paraíso Online</h1>
                <p className="text-xs md:text-sm text-gray-600">Conectando pessoas, marcas e oportunidades.</p>
              </div>
            </Link>
          </div>

          <div className="flex-grow max-w-lg hidden lg:flex items-center justify-center px-4">
            <form onSubmit={handleSearch} className="relative w-full">
                <Input name="search" placeholder="Buscar no portal..." className="pl-10" />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </form>
          </div>

          <div className="hidden lg:flex items-center justify-end gap-2">
              <Link to="/anuncie-aqui">
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 h-auto whitespace-nowrap">
                      <Megaphone size={16} className="mr-2" /> Anuncie Aqui
                  </Button>
              </Link>
              <Link to="/area-do-assinante">
                  <Button size="lg" variant="outline" className="text-green-600 border-green-500 hover:bg-green-50 hover:text-green-700 font-semibold px-4 py-2 h-auto whitespace-nowrap">
                      <Crown size={16} className="mr-2" /> Área do Assinante
                  </Button>
              </Link>
              <Link to="/marketplace">
                  <Button size="lg" variant="outline" className="text-purple-600 border-purple-500 hover:bg-purple-50 hover:text-purple-700 font-semibold px-4 py-2 h-auto whitespace-nowrap">
                      <ShoppingCart size={16} className="mr-2" /> Marketplace
                  </Button>
              </Link>
          </div>

          <div className="lg:hidden flex justify-end">
            <button
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      <nav className="hidden lg:flex bg-blue-800 text-white">
        <div className="container mx-auto px-4 flex justify-center items-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-3 text-sm font-medium transition-all duration-300 hover:bg-blue-700 ${
                  location.pathname === item.path ? 'bg-blue-900' : ''
                }`}
              >
                <item.icon size={16} />
                <span>{item.name}</span>
              </Link>
            ))}
        </div>
      </nav>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden mt-2 pb-4 border-t"
        >
          <div className="p-4">
            <form onSubmit={handleSearch} className="relative">
                <Input name="search" placeholder="Buscar no portal..." className="pl-10" />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </form>
          </div>
          <nav className="flex flex-col space-y-1 p-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all text-base ${
                  location.pathname === item.path
                    ? 'text-white bg-blue-600 font-semibold'
                    : 'text-gray-700 hover:text-blue-900 hover:bg-blue-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-4 border-t mt-2">
              <Link to="/anuncie-aqui">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white w-full py-3 text-base flex items-center space-x-2">
                    <Megaphone size={20} />
                    <span>Anuncie Aqui</span>
                </Button>
              </Link>
               <Link to="/area-do-assinante">
                <Button variant="outline" className="text-green-600 border-green-500 hover:bg-green-50 w-full py-3 text-base flex items-center space-x-2">
                    <Crown size={20} />
                    <span>Área do Assinante</span>
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="outline" className="text-purple-600 border-purple-500 hover:bg-purple-50 w-full py-3 text-base flex items-center space-x-2">
                    <ShoppingCart size={20} />
                    <span>Marketplace</span>
                </Button>
              </Link>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Header;