import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ResumePremiumCTA = ({ handleCertificadoPremium }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-8 text-white text-center mb-12"
    >
      <h2 className="text-3xl font-bold mb-4">🏆 Certificado Premium</h2>
      <p className="text-xl mb-6">
        Potencialize seu currículo com certificações reconhecidas pelo mercado!
      </p>
      <p className="text-lg mb-8 opacity-90">
        Acesse cursos profissionalizantes, certificações e muito mais para se destacar no mercado de trabalho.
      </p>
      <Button 
        onClick={handleCertificadoPremium}
        className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg"
      >
        <ExternalLink className="mr-2" size={20} />
        Acessar Certificado Premium
      </Button>
    </motion.div>
  );
};

export default ResumePremiumCTA;