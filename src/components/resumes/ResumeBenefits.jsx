import React from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, GraduationCap } from 'lucide-react';

const benefits = [
  {
    icon: User,
    title: "Visibilidade",
    description: "Seu currículo ficará disponível para centenas de empresas parceiras",
    color: "gradient-royal"
  },
  {
    icon: Briefcase,
    title: "Oportunidades",
    description: "Receba convites para entrevistas e oportunidades exclusivas",
    color: "gradient-gold"
  },
  {
    icon: GraduationCap,
    title: "Crescimento",
    description: "Acesso a cursos e certificações através do Certificado Premium",
    color: "bg-green-600"
  }
];

const ResumeBenefits = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
    >
      {benefits.map((benefit, index) => {
        const Icon = benefit.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center hover-lift">
            <div className={`w-16 h-16 ${benefit.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Icon className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
            <p className="text-gray-600">{benefit.description}</p>
          </div>
        );
      })}
    </motion.div>
  );
};

export default ResumeBenefits;