import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ShieldCheck, Database, Lock, Server, Cloud, FileLock } from 'lucide-react';

const Security = () => {
    const securityFeatures = [
        {
            icon: ShieldCheck,
            title: "Criptografia de Ponta a Ponta (SSL)",
            description: "Toda a comunicação entre seu navegador e nossos servidores é protegida com criptografia SSL (HTTPS), garantindo que seus dados, como senhas e informações pessoais, sejam transmitidos de forma segura e privada."
        },
        {
            icon: Database,
            title: "Proteção de Banco de Dados",
            description: "Nossos bancos de dados são hospedados em uma infraestrutura de nuvem segura, com acesso restrito e monitoramento constante para prevenir acessos não autorizados e garantir a integridade dos seus dados."
        },
        {
            icon: Lock,
            title: "Segurança de Senhas",
            description: "As senhas dos usuários são armazenadas utilizando algoritmos de hash modernos e seguros. Isso significa que nem mesmo nossa equipe tem acesso à sua senha, apenas à sua representação criptografada."
        },
        {
            icon: Server,
            title: "Backups Automáticos e Redundantes",
            description: "Realizamos backups diários e automáticos de todos os dados do portal. Esses backups são armazenados em locais geograficamente distintos para garantir a recuperação rápida em caso de qualquer imprevisto."
        },
        {
            icon: Cloud,
            title: "Infraestrutura de Nuvem Confiável",
            description: "O Portal Paraíso Online é hospedado em uma infraestrutura de nuvem de classe mundial, que oferece alta disponibilidade, proteção contra ataques (DDoS) e escalabilidade para garantir que o site esteja sempre rápido e acessível."
        },
        {
            icon: FileLock,
            title: "Conformidade com a LGPD",
            description: "Seguimos rigorosamente as diretrizes da Lei Geral de Proteção de Dados (LGPD), assegurando que seus direitos à privacidade, acesso e controle sobre suas informações pessoais sejam sempre respeitados."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Helmet>
                <title>Segurança - Portal Paraíso Online</title>
                <meta name="description" content="Saiba como o Portal Paraíso Online protege seus dados. Conheça nossas medidas de segurança, backups e conformidade com a LGPD." />
            </Helmet>

            <div className="container mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4 flex items-center justify-center">
                        <ShieldCheck className="mr-3 text-green-500" /> Segurança e Confiança
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Sua segurança é nossa prioridade. Veja como protegemos seus dados e garantimos a integridade do nosso portal.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {securityFeatures.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white rounded-lg shadow-lg p-8"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                        <Icon className="text-blue-600" size={24} />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">{feature.title}</h2>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-12 bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-6 rounded-r-lg"
                >
                    <h3 className="font-bold mb-2">Compromisso com a Segurança</h3>
                    <p>Nossa equipe de tecnologia trabalha continuamente para monitorar, atualizar e melhorar nossas defesas contra as ameaças digitais mais recentes. Para assinantes e franqueados, isso significa tranquilidade para focar no que realmente importa: o crescimento do seu negócio.</p>
                </motion.div>
            </div>
        </div>
    );
};

export default Security;