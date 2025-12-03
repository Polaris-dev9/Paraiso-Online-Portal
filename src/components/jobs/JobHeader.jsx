import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const JobHeader = ({ onPostJob }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="bg-gradient-to-r from-blue-800 to-purple-800 rounded-lg shadow-xl p-8 text-white flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 flex items-center">
            <Briefcase className="mr-3" /> Oportunidades de Carreira
          </h1>
          <p className="text-lg text-blue-200">
            Encontre a vaga dos seus sonhos ou o talento que sua empresa precisa.
          </p>
        </div>
        <div className="mt-6 md:mt-0">
          <Button onClick={onPostJob} className="gradient-gold text-white font-semibold px-6 py-3 flex items-center space-x-2">
            <Plus size={20} />
            <span>Publicar Vaga</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobHeader;