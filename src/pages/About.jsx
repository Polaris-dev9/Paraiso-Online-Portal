import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Users, Target, Award, Heart, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  const team = [
    { name: "Diretoria", role: "Diretoria Geral", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=300&h=300&fit=crop&crop=faces", description: "Responsável pela visão estratégica e gestão do portal." },
    { name: "Maria Santos", role: "Editora-Chefe", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=faces", description: "Jornalista especializada em economia local e desenvolvimento regional." },
    { name: "Carlos Oliveira", role: "Gerente de Tecnologia", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces", description: "Especialista em plataformas digitais e inovação tecnológica." },
    { name: "Ana Ferreira", role: "Coordenadora de Eventos", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=faces", description: "Responsável pela organização e cobertura de eventos regionais." },
  ];
  
  const values = [
    { icon: Target, title: "Missão", description: "Conectar pessoas, marcas e oportunidades através de informação de qualidade e serviços inovadores." },
    { icon: Award, title: "Visão", description: "Ser o principal portal de referência da região, reconhecido pela excelência, inovação e confiabilidade." },
    { icon: Heart, title: "Valores", description: "Transparência, compromisso com a comunidade, inovação contínua e responsabilidade social." },
  ];
  
  const achievements = [
    { number: "50K+", label: "Leitores Mensais" },
    { number: "500+", label: "Empresas Parceiras" },
    { number: "1000+", label: "Eventos Cobertos" },
    { number: "5", label: "Anos no Ar" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Sobre Nós - Portal Paraíso Online</title>
        <meta name="description" content="Conheça a história, missão e equipe do Portal Paraíso Online. Conectando pessoas, marcas e oportunidades em São João do Paraíso." />
      </Helmet>

      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">Sobre o Portal Paraíso Online</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Conectando pessoas, marcas e oportunidades.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white rounded-lg shadow-lg overflow-hidden mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-blue-900 mb-6">Nossa História</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Fundado em 2019, o Portal Paraíso Online nasceu da visão de criar um ecossistema digital que unisse a comunidade de São João do Paraíso, fortalecendo o comércio local e facilitando o acesso à informação.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                De um simples guia comercial, evoluímos para a principal plataforma da região, integrando notícias, eventos, empregos, e um marketplace robusto.
              </p>
            </div>
            <div className="relative h-64 lg:h-auto">
              <img class="w-full h-full object-cover" alt="Escritório moderno com pessoas colaborando" src="https://images.unsplash.com/photo-1598737129494-69cb30f96a73" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20"></div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8 text-center hover-lift">
                <div className="w-16 h-16 gradient-royal rounded-full flex items-center justify-center mx-auto mb-6"><Icon className="text-white" size={32} /></div>
                <h3 className="text-xl font-bold text-blue-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            );
          })}
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">Nossos Números</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((a, i) => <div key={i}><div className="text-4xl font-bold mb-2">{a.number}</div><div className="text-lg opacity-90">{a.label}</div></div>)}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="mb-16">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">Nossa Equipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-white rounded-lg shadow-lg overflow-hidden hover-lift">
                <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }} className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Fale Conosco</h2>
          <p className="text-xl mb-8 opacity-90">Tem uma ideia, sugestão ou quer fazer parte da nossa história? Entre em contato conosco!</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-sm sm:text-base">
            <div className="flex items-center justify-center space-x-3"><Mail size={24} /><span>contato@portalparaisoonline.com.br</span></div>
            <div className="flex items-center justify-center space-x-3"><Phone size={24} /><span>(38) 99808-5771</span></div>
            <div className="flex items-center justify-center space-x-3"><MapPin size={24} /><span>São João do Paraíso, MG - Brasil</span></div>
          </div>
          <Link to="/contato"><Button className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg">Ver todos os contatos</Button></Link>
        </motion.div>
      </div>
    </div>
  );
};
export default About;