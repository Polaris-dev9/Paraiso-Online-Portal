import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { HeartHandshake, DollarSign, BarChart, Users, FileText, Mail, Phone, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Franchise = () => {
  const { toast } = useToast();

  const handleContactSubmit = (e) => {
    e.preventDefault();
    toast({
        title: "✅ Mensagem Enviada!",
        description: "Seu interesse foi registrado. Um de nossos consultores entrará em contato em breve.",
    });
    e.target.reset();
  };

  const benefits = [
    { icon: Globe, title: "Domínio Próprio", description: "Opere com um domínio exclusivo para sua cidade, fortalecendo a marca local." },
    { icon: BarChart, title: "Modelo de Negócio Comprovado", description: "Utilize nosso modelo de negócio de sucesso para acelerar seu crescimento." },
    { icon: Users, title: "Suporte Contínuo", description: "Receba treinamento completo, suporte de marketing e assistência operacional." },
    { icon: DollarSign, title: "Múltiplas Fontes de Renda", description: "Explore diversas fontes de receita, como assinaturas, publicidade e eventos." },
  ];

  const steps = [
    { step: 1, title: "Preencha o Formulário", description: "Demonstre seu interesse preenchendo o formulário de contato inicial." },
    { step: 2, title: "Análise de Perfil", description: "Nossa equipe analisará seu perfil e entrará em contato para uma reunião." },
    { step: 3, title: "Circular de Oferta (COF)", description: "Receba e analise a Circular de Oferta de Franquia com todos os detalhes." },
    { step: 4, title: "Assinatura do Contrato", description: "Após a aprovação, assinamos o contrato e iniciamos o treinamento." },
    { step: 5, title: "Lançamento Local", description: "Lance sua unidade do Portal Paraíso Online e comece a operar!" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Seja um Franqueado - Expansão Multicidades - Portal Paraíso Online</title>
        <meta name="description" content="Torne-se um franqueado do Portal Paraíso Online e leve nosso modelo de sucesso para sua cidade. Empreenda com uma marca consolidada." />
      </Helmet>

      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">🤝 Leve o PPO para a sua Cidade</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Junte-se à nossa rede de franquias e construa um negócio digital de sucesso com um modelo de negócio validado e suporte completo.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
            <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-3"
            >
              <h2 className="text-3xl font-bold text-blue-900 mb-8">Vantagens da Nossa Franquia</h2>
              <div className="space-y-6">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 gradient-royal rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="text-white" size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-blue-900">{benefit.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
             <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-2 bg-white p-8 rounded-xl shadow-2xl"
            >
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">Comece sua Expansão Agora!</h3>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                    <Input placeholder="Seu Nome Completo" required/>
                    <Input type="email" placeholder="Seu Melhor E-mail" required/>
                    <Input placeholder="Seu Telefone (com DDD)" required/>
                    <Input placeholder="Cidade de Interesse" required/>
                    <Textarea placeholder="Fale um pouco sobre você e por que quer ser um franqueado." rows={4}/>
                    <Button type="submit" size="lg" className="w-full gradient-gold text-white font-bold text-lg">Quero ser Franqueado</Button>
                </form>
            </motion.div>
        </div>


        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mb-16">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">Como se Tornar um Franqueado</h2>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-200 hidden md:block"></div>
            {steps.map((step, index) => (
              <div key={index} className={`flex items-center w-full mb-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="hidden md:flex w-1/2"></div>
                <div className="hidden md:flex justify-center w-12">
                  <div className="w-8 h-8 bg-blue-600 rounded-full text-white flex items-center justify-center font-bold">{step.step}</div>
                </div>
                <div className="w-full md:w-1/2 bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ainda com dúvidas?</h2>
          <p className="text-xl mb-8 opacity-90">
            Acesse nossos materiais e o contrato de franquia para saber mais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contrato-franquia">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3">
                <FileText className="mr-2" /> Ver Contrato Modelo
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Franchise;