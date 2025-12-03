import React from 'react';
import { motion } from 'framer-motion';

const EventHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">
        🎉 Eventos
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Descubra os melhores eventos da região e participe de experiências incríveis
      </p>
    </motion.div>
  );
};

export default EventHeader;