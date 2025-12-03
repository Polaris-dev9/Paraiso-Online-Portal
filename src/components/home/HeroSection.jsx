import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Megaphone, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactPlayer from 'react-player/lazy';

const HeroSection = () => {
  const showVideoBackground = true; // This can be controlled from an admin panel state

  return (
    <section className="relative text-white pt-16 pb-24 overflow-hidden">
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {showVideoBackground ? (
          <ReactPlayer 
            url='https://videos.pexels.com/video-files/853878/853878-4k.mp4'
            playing
            loop
            muted
            width='100%'
            height='100%'
            className='react-player-cover'
            config={{ file: { attributes: { style: { objectFit: 'cover' }}}}}
          />
        ) : (
          <img class="w-full h-full object-cover" alt="Dynamic cityscape of São João do Paraíso" src="https://images.unsplash.com/photo-1556687944-2e0bf0aa68d8" />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-purple-900/60 z-10"></div>
      <div className="container mx-auto px-4 text-center relative z-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <p className="font-semibold text-blue-300 mb-2">SÃO JOÃO DO PARAÍSO - MG</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
                  Conectando Negócios e Oportunidades
              </h1>
              <p className="text-lg md:text-xl text-blue-200 max-w-3xl mx-auto mb-8 drop-shadow-sm">
                  O maior portal de empresas, notícias e serviços de São João do Paraíso. Descubra, conecte e cresça conosco.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Link to="/cadastre-sua-empresa"><Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 font-semibold flex items-center space-x-2"><UserPlus size={20}/><span>Cadastre sua Empresa</span></Button></Link>
                  <Link to="/assine-agora"><Button size="lg" className="gradient-gold text-white hover:opacity-90 font-semibold flex items-center space-x-2"><Megaphone size={20}/><span>Assine Agora</span></Button></Link>
                  <Link to="/votacao"><Button size="lg" className="bg-white text-amber-600 hover:bg-amber-50 font-semibold flex items-center space-x-2"><Award size={20}/><span>Melhores do Ano</span></Button></Link>
              </div>
          </motion.div>
           <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
              <div className="glass-effect p-6 rounded-xl text-center">
                  <p className="text-4xl font-bold text-yellow-300">500+</p>
                  <p className="text-blue-200">Empresas Cadastradas</p>
              </div>
              <div className="glass-effect p-6 rounded-xl text-center">
                  <p className="text-4xl font-bold text-yellow-300">4.8 ⭐</p>
                  <p className="text-blue-200">Avaliação Média</p>
              </div>
              <div className="glass-effect p-6 rounded-xl text-center">
                  <p className="text-4xl font-bold text-yellow-300">15k+</p>
                  <p className="text-blue-200">Visitas/Mês</p>
              </div>
          </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;