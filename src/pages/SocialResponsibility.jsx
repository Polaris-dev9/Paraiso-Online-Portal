import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { HeartHandshake, Users, Leaf, GraduationCap, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const SocialResponsibility = () => {
    const { toast } = useToast();

    const handleAction = (message) => {
        toast({
            title: "Obrigado pelo seu interesse!",
            description: message,
        });
    };
    
    const causes = [
        {
            icon: Users,
            title: "Apoio à Comunidade Local",
            description: "Promovemos e divulgamos iniciativas que fortalecem o comércio local, a cultura e o bem-estar dos moradores da nossa cidade.",
            image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&h=400&fit=crop"
        },
        {
            icon: GraduationCap,
            title: "Educação e Capacitação",
            description: "Acreditamos no poder da educação para transformar vidas. Apoiamos projetos de capacitação profissional e acesso ao conhecimento para jovens e adultos.",
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop"
        },
        {
            icon: Leaf,
            title: "Sustentabilidade Ambiental",
            description: "Incentivamos e damos visibilidade a ações que promovem a sustentabilidade e a preservação do meio ambiente em nossa região.",
            image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&h=400&fit=crop"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Helmet>
                <title>Responsabilidade Social - Portal Paraíso Online</title>
                <meta name="description" content="Conheça as causas que o Portal Paraíso Online apoia. Junte-se a nós para construir uma comunidade mais forte e solidária." />
            </Helmet>

            <div className="container mx-auto px-4">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">
                        <HeartHandshake className="inline-block mr-3 text-red-500" />
                        Responsabilidade Social
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Acreditamos que, juntos, podemos construir uma comunidade mais forte, justa e sustentável.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-lg shadow-lg p-8 mb-12 text-center"
                >
                    <h2 className="text-2xl font-bold text-blue-900 mb-4">Nosso Compromisso</h2>
                    <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto">
                        O Portal Paraíso Online vai além de ser apenas uma plataforma de notícias e negócios. Temos um profundo compromisso com o desenvolvimento social e ambiental da nossa comunidade. Usamos nossa visibilidade para apoiar causas, promover a conscientização e conectar pessoas que querem fazer a diferença.
                    </p>
                </motion.div>

                <div className="space-y-12">
                    {causes.map((cause, index) => {
                        const Icon = cause.icon;
                        return (
                            <motion.div 
                                key={cause.title}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7 }}
                                viewport={{ once: true, amount: 0.3 }}
                                className={`bg-white rounded-lg shadow-lg overflow-hidden flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                            >
                                <div className="md:w-1/2">
                                    <img src={cause.image} alt={cause.title} className="w-full h-64 md:h-full object-cover" />
                                </div>
                                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                                    <Icon className="text-blue-600 mb-4" size={40} />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{cause.title}</h3>
                                    <p className="text-gray-600 mb-6">{cause.description}</p>
                                    <div className="flex space-x-4">
                                        <Button onClick={() => handleAction("Em breve, mais informações sobre como participar!")} className="gradient-royal text-white">Saiba Mais</Button>
                                        <Button onClick={() => handleAction("A área de parceiros desta causa está em desenvolvimento.")} variant="outline">Ver Parceiros</Button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-16 text-center bg-gradient-to-r from-green-500 to-teal-500 text-white p-12 rounded-lg"
                >
                    <h2 className="text-3xl font-bold mb-4">Faça Parte da Mudança</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Você representa uma causa, ONG ou projeto social? Entre em contato conosco e vamos juntos multiplicar o bem!
                    </p>
                     <Button onClick={() => handleAction("Você será redirecionado para o nosso contato.")} size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8 py-3 flex items-center space-x-2 mx-auto">
                        <LinkIcon size={20} />
                        <span>Indique uma Causa</span>
                    </Button>
                </motion.div>
            </div>
        </div>
    );
};

export default SocialResponsibility;