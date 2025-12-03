import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const FeedbackSection = () => {
  const { toast } = useToast();

  const testimonials = [
    {
      name: 'Ana Clara',
      role: 'Empresária',
      feedback: 'O portal aumentou a visibilidade da minha loja em 200%! A ferramenta de marketplace é fantástica e fácil de usar.',
      rating: 5,
    },
    {
      name: 'Marcos Rocha',
      role: 'Profissional Liberal',
      feedback: 'Consegui ótimos contatos através do Guia Profissional. A plataforma é intuitiva e me conectou com clientes que eu não alcançaria sozinho.',
      rating: 5,
    },
    {
      name: 'Juliana Santos',
      role: 'Usuária do Portal',
      feedback: 'Adoro ficar por dentro das notícias e eventos da cidade. O fórum é um ótimo lugar para trocar ideias com a comunidade!',
      rating: 4,
    },
  ];

  const handleFeedbackSubmit = () => {
    toast({
      title: '✅ Feedback Recebido!',
      description: 'Obrigado por compartilhar sua opinião conosco.',
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-blue-900">O que Nossos Usuários Dizem</h2>
          <p className="text-gray-600 mt-2">A satisfação de quem usa o portal é nossa maior recompensa.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="fill-current" />
                  ))}
                  {[...Array(5 - testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="text-gray-300" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">"{testimonial.feedback}"</p>
              <div>
                <p className="font-bold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Button onClick={handleFeedbackSubmit} size="lg" className="gradient-gold text-white font-bold">
            <MessageSquare className="mr-2" /> Deixe seu Feedback
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeedbackSection;