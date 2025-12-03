import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const { toast } = useToast();

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const newContact = { id: Date.now(), ...formData, createdAt: new Date().toISOString() };
    console.log("Novo contato:", newContact);

    toast({
      title: "✅ Mensagem enviada com sucesso!",
      description: "Recebemos sua mensagem e entraremos em contato em breve.",
    });
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactInfo = [
    { icon: Mail, title: "E-mail Principal", info: "contato@portalparaisoonline.com.br", description: "Para assuntos gerais." },
    { icon: Phone, title: "WhatsApp", info: "(38) 99808-5771 / (38) 99727-9279", description: "Atendimento comercial e suporte." },
    { icon: Phone, title: "Telefone (Apenas Ligação)", info: "(38) 99974-5758", description: "Para contato direto por voz." },
    { icon: MapPin, title: "Nosso Escritório", info: "Rua Vicente Gomes, 231 - Sala 4 - Centro", description: "São João do Paraíso - MG, 39540-000" },
  ];

  const departments = [
    { name: "Redação", email: "redacao@portalparaisoonline.com.br", description: "Sugestões de pautas, denúncias e informações." },
    { name: "Comercial", email: "comercial@portalparaisoonline.com.br", description: "Publicidade, patrocínios e parcerias." },
    { name: "Suporte Técnico", email: "suporte@portalparaisoonline.com.br", description: "Problemas técnicos e dúvidas sobre assinaturas." },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Contato - Portal Paraíso Online</title>
        <meta name="description" content="Entre em contato com o Portal Paraíso Online. Estamos aqui para ouvir suas sugestões, dúvidas e propostas de parceria." />
      </Helmet>

      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">📞 Entre em Contato</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Estamos aqui para ouvir você! Envie suas sugestões, dúvidas ou propostas.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center"><MessageSquare className="mr-3" /> Envie sua Mensagem</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Nome Completo *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Seu nome completo" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">E-mail *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="seu@email.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Telefone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="(38) 99999-9999" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Assunto *</label>
                    <select name="subject" value={formData.subject} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Selecione um assunto</option>
                      <option value="sugestao-pauta">Sugestão de Pauta</option>
                      <option value="publicidade">Publicidade</option>
                      <option value="suporte">Suporte Técnico</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Mensagem *</label>
                  <textarea name="message" value={formData.message} onChange={handleInputChange} required rows={6} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Descreva sua mensagem detalhadamente..." />
                </div>
                <Button type="submit" className="w-full gradient-royal text-white hover:opacity-90 py-3 text-lg font-semibold"><Send className="mr-2" size={20} /> Enviar Mensagem</Button>
              </form>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-6">Nossos Contatos</h3>
              <div className="space-y-4">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-10 h-10 gradient-royal rounded-full flex items-center justify-center flex-shrink-0"><Icon className="text-white" size={18} /></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-blue-600 font-medium">{item.info}</p>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
               <a href="https://share.google/leBVxKRV7eV67Dnpn" target="_blank" rel="noopener noreferrer" className="mt-4 w-full"><Button variant="outline" className="w-full mt-4">Ver no Google Maps</Button></a>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-6">Departamentos</h3>
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                    <h4 className="font-semibold text-gray-900">{dept.name}</h4>
                    <p className="text-blue-600 text-sm font-medium">{dept.email}</p>
                    <p className="text-gray-600 text-xs">{dept.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Contact;