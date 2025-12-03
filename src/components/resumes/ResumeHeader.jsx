import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ResumeHeader = ({ setShowForm, handleCertificadoPremium }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">
        📄 Banco de Currículos
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
        Cadastre seu currículo e seja encontrado pelas melhores empresas da região
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={() => setShowForm(true)}
          className="gradient-royal text-white hover:opacity-90 px-8 py-3 text-lg font-semibold"
        >
          <Plus className="mr-2" size={20} />
          Cadastrar Currículo
        </Button>
        <Button 
          onClick={handleCertificadoPremium}
          className="gradient-gold text-white hover:opacity-90 px-8 py-3 text-lg font-semibold"
        >
          <ExternalLink className="mr-2" size={20} />
          Certificado Premium
        </Button>
      </div>
    </motion.div>
  );
};

export default ResumeHeader;