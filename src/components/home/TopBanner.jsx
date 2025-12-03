import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const TopBanner = ({ isBottom = false }) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const banners = Array.from({
    length: 12
  }, (_, i) => ({
    id: i + 1,
    image: `https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=200&fit=crop&q=80&random=${i + (isBottom ? 20 : 0)}`,
    title: `Empresa Anunciante ${i + 1}`,
    link: '/anuncie-aqui'
  }));

  useEffect(() => {
    const bannerInterval = setInterval(() => setCurrentBanner(prev => (prev + 1) % banners.length), 5000);
    return () => clearInterval(bannerInterval);
  }, [banners.length]);
  
  const sectionClasses = isBottom ? "py-12 bg-gray-100" : "py-4 relative -mt-12 z-30";
  const linkClasses = "block relative h-40 md:h-48 bg-gray-200 rounded-lg overflow-hidden shadow-lg hover-lift";

  return (
    <section className={sectionClasses}>
      <div className="container mx-auto px-4">
        <Link to={banners[currentBanner].link} className={linkClasses}>
          <AnimatePresence>
            <motion.div
              key={currentBanner}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="w-full h-full absolute"
            >
              <img src={banners[currentBanner].image} alt={banners[currentBanner].title} className="w-full h-full object-cover"  src="https://images.unsplash.com/photo-1604257601296-65d349c74773" />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
            <h3 className="text-white text-xl md:text-2xl font-bold text-center drop-shadow-md">{banners[currentBanner].title}</h3>
          </div>
        </Link>
      </div>
    </section>
  );
};
export default TopBanner;