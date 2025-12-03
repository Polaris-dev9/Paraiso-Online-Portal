import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, HeartHandshake, Info, Award, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactPlayer from 'react-player/lazy';

const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

const createDummyData = (count, baseTitle) => {
  return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      title: `${baseTitle} ${i + 1}`,
  }));
};

const MainContent = () => {
  const [shuffledLeftBanners, setShuffledLeftBanners] = useState([]);
  const [shuffledRightBanners, setShuffledRightBanners] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const allSideBanners = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Portal Paraíso Online - ANUNCIE AQUI`,
    link: '/anuncie-aqui'
  }));

  const vipVideos = [
    { id: 1, title: 'Conheça o Portal Paraíso Online', videoUrl: 'https://www.youtube.com/watch?v=Cn-a0I2P3S4' },
    { id: 2, title: 'Anunciante VIP 1: Sabor Divino', videoUrl: 'https://www.youtube.com/watch?v=o-YBDTqX_ZU' },
    { id: 3, title: 'Anunciante VIP 2: Tech Solutions', videoUrl: 'https://www.youtube.com/watch?v=N9c7_4-fX_c' },
    { id: 4, title: 'Anunciante VIP 3: Moda & Estilo', videoUrl: 'https://www.youtube.com/watch?v=3-M-s-D2A4Y' },
    { id: 5, title: 'Anunciante VIP 4: ConstruForte', videoUrl: 'https://www.youtube.com/watch?v=Bey4XXJAqS8' },
  ];

  useEffect(() => {
    const reshuffleContent = () => {
      const shuffled = shuffleArray([...allSideBanners]);
      setShuffledLeftBanners(shuffled.slice(0, 10));
      setShuffledRightBanners(shuffled.slice(10, 20));
      
      setCurrentVideoIndex(Math.floor(Math.random() * vipVideos.length));
    };
    reshuffleContent();
    const interval = setInterval(reshuffleContent, 30000); // Reshuffle every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const highlightSections = [
    { title: "Eventos em Destaque", link: "/eventos", data: createDummyData(6, "Evento") },
    { title: "Empresas em Destaque", link: "/guia-comercial", data: createDummyData(6, "Empresa") },
    { title: "Produtos em Destaque", link: "/marketplace", data: createDummyData(6, "Produto") },
    { title: "Lojas em Destaque", link: "/marketplace", data: createDummyData(6, "Loja") },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3 space-y-6">
            <h3 className="font-bold text-lg text-blue-900 border-b-2 border-blue-200 pb-2">Destaques</h3>
          {shuffledLeftBanners.map(banner => (
            <Link to={banner.link} key={`left-${banner.id}`} className="block bg-white rounded-lg shadow-lg overflow-hidden hover-lift">
              <img alt={banner.title} className="w-full h-40 object-cover"  src="https://images.unsplash.com/photo-1697862040431-f149c8e1ac9d" />
              <div className="p-2 bg-gray-100"><p className="text-center text-sm font-semibold text-blue-800">{banner.title}</p></div>
            </Link>
          ))}
        </aside>

        <main className="lg:col-span-6 space-y-12">
          <section className="bg-black rounded-lg shadow-lg overflow-hidden">
               <div className="relative pt-[56.25%]">
                  <AnimatePresence>
                      <ReactPlayer
                          key={currentVideoIndex}
                          url={vipVideos[currentVideoIndex].videoUrl}
                          width="100%"
                          height="100%"
                          playing={false}
                          controls={true}
                          light={true}
                          className="absolute top-0 left-0"
                      />
                  </AnimatePresence>
               </div>
               <div className="p-4 bg-gray-900 text-white">
                  <h3 className="font-bold text-lg text-yellow-400">Vídeo VIP</h3>
                  <p className="text-sm text-gray-300">{vipVideos[currentVideoIndex].title}</p>
              </div>
          </section>
          
          {highlightSections.map((section, sectionIndex) => (
               <section key={section.title}>
                  <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-blue-900">{section.title}</h2>
                      <Link to={section.link}>
                          <Button variant="outline" className="text-blue-900 border-blue-900 hover:bg-blue-50">Ver todas <ArrowRight size={16} className="ml-2" /></Button>
                      </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {section.data.map((item, itemIndex) => (
                          <Link to={section.link} key={item.id} className="block group">
                              <div className="relative rounded-lg overflow-hidden shadow-md">
                                  <img alt={item.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"  src="https://images.unsplash.com/photo-1516116216624-53e697fedbea" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                  <p className="absolute bottom-2 left-2 text-white font-semibold text-sm drop-shadow-md">{item.title}</p>
                              </div>
                          </Link>
                      ))}
                  </div>
              </section>
          ))}

          <div className="space-y-4">
              <Link to="/utilidades" className="block p-6 rounded-lg shadow-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover-lift">
                  <div className="flex items-center space-x-4">
                      <Info size={40} />
                      <div>
                          <h3 className="text-2xl font-bold">Utilidades Públicas</h3>
                          <p>Telefones úteis, serviços e informações importantes para o seu dia a dia.</p>
                      </div>
                  </div>
              </Link>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link to="/responsabilidade-social" className="flex items-center justify-center p-4 rounded-lg shadow-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white hover-lift"><HeartHandshake className="mr-2" /> <span className="font-semibold">Responsabilidade Social</span></Link>
                  <Link to="/tutorial" className="flex items-center justify-center p-4 rounded-lg shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white hover-lift"><Award className="mr-2" /> <span className="font-semibold">Tutorial do Portal</span></Link>
                  <Link to="/tour" className="flex items-center justify-center p-4 rounded-lg shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover-lift"><MapPin className="mr-2" /> <span className="font-semibold">Tour pelo Portal</span></Link>
              </div>
          </div>

        </main>

        <aside className="lg:col-span-3 space-y-6">
          <h3 className="font-bold text-lg text-blue-900 border-b-2 border-blue-200 pb-2">Recomendados</h3>
          {shuffledRightBanners.map(banner => (
            <Link to={banner.link} key={`right-${banner.id}`} className="block bg-white rounded-lg shadow-lg overflow-hidden hover-lift">
              <img alt={banner.title} className="w-full h-40 object-cover"  src="https://images.unsplash.com/photo-1697862040431-f149c8e1ac9d" />
              <div className="p-2 bg-gray-100"><p className="text-center text-sm font-semibold text-blue-800">{banner.title}</p></div>
            </Link>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default MainContent;