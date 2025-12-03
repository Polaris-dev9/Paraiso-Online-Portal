import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { LifeBuoy, BookOpen, Video, MessageSquare, PlusCircle, Send, Loader2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const TicketForm = ({ onCancel, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ subject: '', department: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, department: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSubmit(formData);
      setLoading(false);
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Abrir Novo Chamado</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <Input name="subject" placeholder="Assunto do chamado" onChange={handleChange} required />
            <Select onValueChange={handleSelectChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="suporte_tecnico">Suporte Técnico</SelectItem>
                <SelectItem value="financeiro">Financeiro</SelectItem>
                <SelectItem value="comercial">Comercial</SelectItem>
                <SelectItem value="sugestoes">Sugestões</SelectItem>
              </SelectContent>
            </Select>
            <Textarea name="message" placeholder="Descreva seu problema ou dúvida..." rows={5} onChange={handleChange} required />
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Enviar Chamado
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Helpdesk = () => {
  const { toast } = useToast();
  const [showTicketForm, setShowTicketForm] = useState(false);

  const faqs = [
    { q: "Como cadastro minha empresa?", a: "Vá para a página 'Cadastre sua Empresa', preencha o formulário e aguarde a aprovação da nossa equipe." },
    { q: "Como funcionam os planos de assinatura?", a: "Oferecemos planos com diferentes benefícios. Visite a página 'Assine Agora' para mais detalhes." },
    { q: "Posso anunciar no portal sem ser assinante?", a: "Sim! Visite a página 'Anuncie Aqui' e preencha o formulário para que nossa equipe comercial entre em contato." },
    { q: "Onde vejo minhas faturas?", a: "Acesse a 'Área do Assinante' com seu login e senha para gerenciar pagamentos e faturas." },
  ];

  const handleOpenTicket = () => {
    setShowTicketForm(true);
  };

  const handleCancelTicket = () => {
    setShowTicketForm(false);
  };

  const handleSubmitTicket = (data) => {
    console.log("Novo chamado:", data);
    setShowTicketForm(false);
    toast({
      title: "✅ Chamado Aberto!",
      description: "Sua solicitação foi registrada. Nossa equipe responderá em breve.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>Central de Suporte - Portal Paraíso Online</title>
        <meta name="description" content="Encontre respostas para suas dúvidas, acesse tutoriais e entre em contato com nosso suporte." />
      </Helmet>

      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">
            <LifeBuoy className="inline-block mr-3" />
            Central de Suporte
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos aqui para ajudar! Encontre respostas, tutoriais e canais de contato.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[
            { icon: BookOpen, title: "Perguntas Frequentes", desc: "Respostas rápidas para as dúvidas mais comuns." },
            { icon: Video, title: "Tutoriais em Vídeo", desc: "Aprenda a usar a plataforma com nossos guias." },
            { icon: PlusCircle, title: "Abrir um Chamado", desc: "Fale com nossa equipe para resolver problemas.", action: handleOpenTicket, isButton: true },
          ].map((item, index) => {
            const Icon = item.icon;
            const cardContent = (
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <Icon className="mr-3" size={24} /> {item.title}
                </CardTitle>
                <CardContent className="pt-4 px-0 pb-0 text-gray-600">{item.desc}</CardContent>
              </CardHeader>
            );

            if (item.isButton) {
              return (
                <motion.div key={index} whileHover={{ y: -5 }} className="h-full">
                  <Card onClick={item.action} className="h-full cursor-pointer hover:shadow-xl transition-shadow bg-blue-50 border-blue-200">
                    {cardContent}
                  </Card>
                </motion.div>
              );
            }
            return (
              <motion.div key={index} whileHover={{ y: -5 }} className="h-full">
                <Card className="h-full hover:shadow-lg transition-shadow">{cardContent}</Card>
              </motion.div>
            );
          })}
        </div>

        {showTicketForm && <TicketForm onCancel={handleCancelTicket} onSubmit={handleSubmitTicket} />}

        {!showTicketForm && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Perguntas Frequentes (FAQ)</h2>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto bg-white p-4 rounded-lg shadow-md">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg text-left hover:no-underline">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-base text-gray-700">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
};

export default Helpdesk;