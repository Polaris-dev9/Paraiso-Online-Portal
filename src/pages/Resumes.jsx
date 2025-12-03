import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { User, Briefcase, GraduationCap, ExternalLink, Plus, Send, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';

const ResumeForm = ({ setShowForm }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    area: '',
    experience: '',
    education: '',
    skills: '',
    summary: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, experience: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Form data submitted:", formData);
    
    toast({
      title: '✅ Currículo enviado com sucesso!',
      description: 'Seu currículo foi adicionado ao nosso banco de talentos.',
    });
    setLoading(false);
    setShowForm(false);
    setFormData({ name: '', email: '', phone: '', location: '', area: '', experience: '', education: '', skills: '', summary: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-xl p-8 mb-12"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-900">Cadastrar Currículo</h2>
        <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
          <X className="h-6 w-6" />
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Nome Completo *</label>
            <Input name="name" value={formData.name} onChange={handleInputChange} required placeholder="Seu nome completo" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">E-mail *</label>
            <Input name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="seu@email.com" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Telefone *</label>
            <Input name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="(11) 99999-9999" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Localização *</label>
            <Input name="location" value={formData.location} onChange={handleInputChange} required placeholder="Cidade, Estado" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Profissão/Área *</label>
                <Input name="area" value={formData.area} onChange={handleInputChange} required placeholder="Ex: Desenvolvedor, Vendedor, Analista..." />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Experiência (anos)</label>
                <Select onValueChange={handleSelectChange} value={formData.experience}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0">Sem experiência</SelectItem>
                        <SelectItem value="1">Menos de 1 ano</SelectItem>
                        <SelectItem value="2">1 a 3 anos</SelectItem>
                        <SelectItem value="3">3 a 5 anos</SelectItem>
                        <SelectItem value="5">Mais de 5 anos</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Formação Acadêmica</label>
          <Textarea name="education" value={formData.education} onChange={handleInputChange} placeholder="Ex: Graduação em Administração - Universidade XYZ (2020)" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Principais Habilidades</label>
          <Textarea name="skills" value={formData.skills} onChange={handleInputChange} placeholder="Ex: Excel avançado, Inglês fluente, Gestão de equipes..." />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Resumo Profissional</label>
          <Textarea name="summary" value={formData.summary} onChange={handleInputChange} rows={4} placeholder="Conte um pouco sobre sua experiência e objetivos profissionais..." />
        </div>
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" className="gradient-royal text-white" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Cadastrar Currículo
          </Button>
        </div>
      </form>
    </motion.div>
  );
};


const ResumeHeader = ({ setShowForm }) => (
  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
    <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">📄 Banco de Currículos</h1>
    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">Cadastre seu currículo e seja encontrado pelas melhores empresas da região</p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button onClick={() => setShowForm(true)} className="gradient-royal text-white hover:opacity-90 px-8 py-3 text-lg font-semibold"><Plus className="mr-2" size={20} /> Cadastrar Currículo</Button>
      <a href="https://www.certificadopremium.com.br/" target="_blank" rel="noopener noreferrer">
        <Button className="gradient-gold text-white hover:opacity-90 px-8 py-3 text-lg font-semibold w-full"><ExternalLink className="mr-2" size={20} /> Certificado Premium</Button>
      </a>
    </div>
  </motion.div>
);

const ResumeBenefits = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
    {[
      { icon: User, title: "Visibilidade", description: "Seu currículo ficará disponível para centenas de empresas parceiras.", color: "gradient-royal" },
      { icon: Briefcase, title: "Oportunidades", description: "Receba convites para entrevistas e oportunidades exclusivas.", color: "gradient-gold" },
      { icon: GraduationCap, title: "Crescimento", description: "Acesso a cursos e certificações através do Certificado Premium.", color: "bg-green-600" }
    ].map((benefit, index) => {
      const Icon = benefit.icon;
      return (
        <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center hover-lift">
          <div className={`w-16 h-16 ${benefit.color} rounded-full flex items-center justify-center mx-auto mb-4`}><Icon className="text-white" size={32} /></div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
          <p className="text-gray-600">{benefit.description}</p>
        </div>
      );
    })}
  </motion.div>
);

const ResumeHowItWorks = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="bg-white rounded-lg shadow-lg p-8 mb-12">
    <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">🚀 Como Funciona</h2>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        { number: 1, title: "Cadastre-se", description: "Preencha seus dados e informações profissionais." },
        { number: 2, title: "Seja Encontrado", description: "Empresas visualizam seu perfil em nosso banco de talentos." },
        { number: 3, title: "Receba Convites", description: "Empresas interessadas entram em contato diretamente." },
        { number: 4, title: "Conquiste a Vaga", description: "Participe do processo seletivo e conquiste sua oportunidade." }
      ].map((step) => (
        <div key={step.number} className="text-center">
          <div className={`w-12 h-12 ${step.number === 4 ? 'gradient-gold' : 'gradient-royal'} rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl`}>{step.number}</div>
          <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
          <p className="text-sm text-gray-600">{step.description}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

const ResumePremiumCTA = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-8 text-white text-center mb-12">
    <h2 className="text-3xl font-bold mb-4">🏆 Certificado Premium</h2>
    <p className="text-xl mb-6">Potencialize seu currículo com certificações reconhecidas pelo mercado!</p>
    <p className="text-lg mb-8 opacity-90">Acesse cursos profissionalizantes, certificações e muito mais para se destacar no mercado de trabalho.</p>
    <a href="https://www.certificadopremium.com.br/" target="_blank" rel="noopener noreferrer">
      <Button className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg"><ExternalLink className="mr-2" size={20} /> Acessar Certificado Premium</Button>
    </a>
  </motion.div>
);

const Resumes = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>Banco de Currículos - Portal Paraíso Online</title>
        <meta name="description" content="Cadastre seu currículo em nosso banco de talentos e seja encontrado pelas melhores empresas da região." />
      </Helmet>
      <div className="container mx-auto px-4">
        <ResumeHeader setShowForm={setShowForm} />
        <ResumeBenefits />
        <AnimatePresence>
          {showForm && <ResumeForm setShowForm={setShowForm} />}
        </AnimatePresence>
        <ResumeHowItWorks />
        <ResumePremiumCTA />
      </div>
    </div>
  );
};

export default Resumes;