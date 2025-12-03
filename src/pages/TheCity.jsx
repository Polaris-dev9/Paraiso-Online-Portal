import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Building, Landmark, Users, Award, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const TheCity = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const { toast } = useToast();

  const cityImages = [
    "https://images.unsplash.com/photo-1563911302254-5a6a4a69481d?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1583443649192-d13135225a48?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1599658880121-d40f278a15e8?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1549918433-39d78a138e0f?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1568668392377-395d2b3344fb?w=800&h=500&fit=crop",
  ];

  const winners = [
    { name: "Restaurante Sabor Divino", category: "Restaurante do Ano", logo: "🍽️" },
    { name: "Tech Solutions Ltda", category: "Empresa Inovadora", logo: "💡" },
    { name: "Dra. Ana Costa", category: "Profissional de Saúde", logo: "👩‍⚕️" },
  ];

  const handleVideoPlay = () => {
    toast({
      title: "▶️ Play no vídeo",
      description: "Esta funcionalidade ainda não foi implementada—mas não se preocupe! Você pode solicitá-la no seu próximo prompt! 🚀",
    });
  };

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % cityImages.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + cityImages.length) % cityImages.length);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>A Cidade - Portal Paraíso Online</title>
        <meta name="description" content="Conheça a história, os pontos turísticos e os destaques de nossa cidade. Um guia completo oferecido pelo Portal Paraíso Online." />
      </Helmet>

      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">🏙️ Conheça Nossa Cidade</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Um lugar de gente acolhedora, belezas naturais e grandes oportunidades.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Nossa História</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Fundada em 1888, nossa cidade tem uma rica história marcada pelo pioneirismo de seus fundadores e pelo desenvolvimento da agricultura e do comércio. Ao longo dos anos, transformou-se em um polo regional, atraindo investimentos e novos moradores.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Hoje, equilibramos a tradição com a modernidade, preservando nosso patrimônio cultural enquanto abraçamos a inovação e o progresso.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Dados da Cidade</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <Users className="mx-auto text-blue-600 mb-2" size={32} />
                <p className="text-2xl font-bold text-gray-800">50.000+</p>
                <p className="text-gray-600">Habitantes</p>
              </div>
              <div className="text-center">
                <Landmark className="mx-auto text-blue-600 mb-2" size={32} />
                <p className="text-2xl font-bold text-gray-800">135 anos</p>
                <p className="text-gray-600">de História</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mb-16">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-8">Galeria de Fotos e Vídeo</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 relative rounded-lg shadow-lg overflow-hidden">
              <img src={cityImages[currentImage]} alt="Vista da cidade" className="w-full h-96 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full text-gray-800"><ChevronLeft /></button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full text-gray-800"><ChevronRight /></button>
            </div>
            <div className="relative rounded-lg shadow-lg overflow-hidden">
              <img  alt="Vídeo da cidade" className="w-full h-96 object-cover" src="https://images.unsplash.com/photo-1646261884804-a9f4aa399c07" />
              <div className="absolute inset-0 video-overlay flex items-center justify-center">
                <button onClick={handleVideoPlay} className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 hover:bg-opacity-30 transition-all">
                  <Play size={32} className="text-white ml-1" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <h3 className="text-white font-semibold">Um Tour Pela Nossa Cidade</h3>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-6 flex items-center justify-center"><Award className="mr-3" /> Destaques do Ano</h2>
          <p className="text-xl mb-8 opacity-90">
            Conheça alguns dos vencedores do prêmio "Melhores do Ano" que contribuem para o crescimento da nossa cidade.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {winners.map((winner, index) => (
              <div key={index} className="bg-white/20 rounded-lg p-6 backdrop-blur-sm">
                <div className="text-4xl mb-3">{winner.logo}</div>
                <h3 className="font-bold text-lg">{winner.name}</h3>
                <p className="text-sm opacity-80">{winner.category}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TheCity;