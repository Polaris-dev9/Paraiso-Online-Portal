import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Star, MessageSquare as MessageSquareQuote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const Testimonials = () => {
    const { toast } = useToast();
    
    const testimonials = [
        {
            name: 'João Silva',
            company: 'Restaurante Sabor Divino',
            text: 'O Portal Paraíso Online foi um divisor de águas para o meu restaurante. A visibilidade que ganhamos resultou em um aumento de 30% no movimento. É o melhor investimento em publicidade local que já fiz!',
            rating: 5,
            image: 'https://randomuser.me/api/portraits/men/32.jpg',
        },
        {
            name: 'Maria Oliveira',
            company: 'Moda & Estilo Boutique',
            text: 'Desde que anunciei no portal, minhas vendas online decolaram. A plataforma é fácil de usar e o suporte da equipe é excelente. Recomendo a todos os lojistas da cidade!',
            rating: 5,
            image: 'https://randomuser.me/api/portraits/women/44.jpg',
        },
        {
            name: 'Carlos Pereira',
            company: 'Tech Solutions Ltda',
            text: 'Conseguimos fechar dois grandes projetos através dos contatos que vieram pelo Portal. A página personalizada nos dá uma imagem muito profissional e atrai os clientes certos.',
            rating: 5,
            image: 'https://randomuser.me/api/portraits/men/33.jpg',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Helmet>
                <title>Depoimentos - Portal Paraíso Online</title>
                <meta name="description" content="Veja o que nossos parceiros e assinantes estão dizendo sobre o Portal Paraíso Online. Histórias de sucesso e crescimento." />
            </Helmet>

            <div className="container mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4 flex items-center justify-center">
                       <MessageSquareQuote className="mr-3" /> Nossos Clientes Satisfeitos
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Histórias reais de empresas que cresceram com o Portal Paraíso Online.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center text-center"
                        >
                            <img src={testimonial.image} alt={testimonial.name} className="w-24 h-24 rounded-full mb-4 border-4 border-yellow-400" />
                            <h3 className="text-xl font-bold text-gray-900">{testimonial.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{testimonial.company}</p>
                            <div className="flex text-yellow-400 my-2">
                                {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="fill-current" />)}
                            </div>
                            <p className="text-gray-700 italic leading-relaxed">"{testimonial.text}"</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-center mt-16"
                >
                    <h2 className="text-3xl font-bold text-blue-900 mb-4">Faça Parte da Nossa História de Sucesso!</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                        Junte-se a dezenas de empresas locais que estão transformando sua presença digital e alcançando mais clientes.
                    </p>
                    <Link to="/anuncie">
                        <Button size="lg" className="gradient-gold text-white font-bold">Quero Anunciar Agora!</Button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Testimonials;