import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { number: 1, title: "Cadastre-se", description: "Preencha seus dados e informações profissionais" },
  { number: 2, title: "Seja Encontrado", description: "Empresas visualizam seu perfil em nosso banco de talentos" },
  { number: 3, title: "Receba Convites", description: "Empresas interessadas entram em contato diretamente" },
  { number: 4, title: "Conquiste a Vaga", description: "Participe do processo seletivo e conquiste sua oportunidade" }
];

const ResumeHowItWorks = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white rounded-lg shadow-lg p-8 mb-12"
    >
      <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
        🚀 Como Funciona
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {steps.map((step) => (
          <div key={step.number} className="text-center">
            <div className={`w-12 h-12 ${step.number === 4 ? 'gradient-gold' : 'gradient-royal'} rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl`}>
              {step.number}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-sm text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ResumeHowItWorks;