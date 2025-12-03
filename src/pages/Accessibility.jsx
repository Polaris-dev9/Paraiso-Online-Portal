import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Accessibility as UniversalAccess, Volume2, Contrast, ZoomIn, Hand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { Link } from 'react-router-dom';

const Accessibility = () => {
    const { toast } = useToast();
    const [vlibrasActive, setVlibrasActive] = useState(false);

    const handleFeature = (feature) => {
        if(feature === 'Agente de Libras') {
             setVlibrasActive(!vlibrasActive);
             const scriptId = 'vlibras-plugin-script';
             let script = document.getElementById(scriptId);

             if(!vlibrasActive && !script) {
                script = document.createElement('script');
                script.id = scriptId;
                script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
                script.async = true;
                script.onload = () => {
                    new window.VLibras.Widget('https://vlibras.gov.br/app');
                };
                document.body.appendChild(script);
                toast({
                    title: '✅ Agente de Libras Ativado',
                    description: 'O agente de Libras foi carregado com sucesso!',
                });
             } else {
                 toast({
                    title: 'ℹ️ Agente de Libras',
                    description: 'O agente de Libras já está ativo ou sendo desativado.',
                });
             }
        } else {
            toast({
                title: 'Recurso de Acessibilidade',
                description: `A funcionalidade '${feature}' está em desenvolvimento e será implementada em breve.`,
            });
        }
    };

    const features = [
        { icon: Hand, title: "Agente de Libras Virtual", description: "Tradução de todo o conteúdo do portal para a Língua Brasileira de Sinais (Libras) em tempo real.", action: () => handleFeature('Agente de Libras') },
        { icon: Volume2, title: "Leitura em Áudio", description: "Ouça o conteúdo das páginas com controles de velocidade, pausa e voz.", action: () => handleFeature('Leitura em Áudio') },
        { icon: Contrast, title: "Modo Alto Contraste", description: "Altera as cores do site para uma paleta com maior contraste, facilitando a leitura.", action: () => handleFeature('Alto Contraste') },
        { icon: ZoomIn, title: "Aumento de Fonte e Lupa", description: "Aumente o tamanho do texto e utilize uma lupa virtual para focar em áreas específicas.", action: () => handleFeature('Aumento de Fonte') },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Helmet>
                <title>Acessibilidade - Portal Paraíso Online</title>
                <meta name="description" content="Nosso compromisso com um portal acessível para todos. Conheça nossos recursos de acessibilidade." />
            </Helmet>

            <div className="container mx-auto px-4">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <UniversalAccess className="mx-auto h-16 w-16 text-blue-600 mb-4" />
                    <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">Compromisso com a Acessibilidade</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Acreditamos que a informação deve ser para todos. Estamos trabalhando para tornar nosso portal 100% acessível.
                    </p>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-lg shadow-xl p-8 mb-16">
                     <h2 className="text-3xl font-bold text-blue-900 text-center mb-8">Tour Virtual Interativo</h2>
                     <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
                         Faça um tour guiado pelas principais áreas do nosso portal. Uma 'lupa virtual' destacará as seções importantes para você não perder nada.
                     </p>
                     <div className="text-center">
                         <Link to="/tour">
                             <Button size="lg" className="gradient-gold text-white font-bold">Iniciar Tour Virtual</Button>
                         </Link>
                     </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center text-center"
                            >
                                <Icon className="h-12 w-12 text-blue-600 mb-4" />
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h2>
                                <p className="text-gray-600 mb-6 flex-grow">{feature.description}</p>
                                <Button onClick={feature.action} variant="outline">Ativar Recurso</Button>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <h2 className="text-3xl font-bold text-blue-900 text-center mb-8">Perguntas Frequentes</h2>
                    <Accordion allowZeroExpanded className="bg-white p-4 rounded-lg shadow-lg">
                        <AccordionItem>
                            <AccordionItemHeading>
                                <AccordionItemButton className="flex justify-between w-full p-4 font-semibold text-left text-gray-800 bg-gray-50 rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                                    O que é acessibilidade web?
                                </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel className="p-4 text-gray-700">
                                Acessibilidade web significa que sites, ferramentas e tecnologias são projetados e desenvolvidos para que pessoas com deficiência possam usá-los. Mais especificamente, para que possam perceber, entender, navegar e interagir com a Web.
                            </AccordionItemPanel>
                        </AccordionItem>
                        <AccordionItem>
                            <AccordionItemHeading>
                                <AccordionItemButton className="flex justify-between w-full p-4 font-semibold text-left text-gray-800 bg-gray-50 rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 mt-2">
                                    Como posso reportar um problema de acessibilidade?
                                </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel className="p-4 text-gray-700">
                                Sua ajuda é muito importante! Se você encontrar qualquer barreira de acessibilidade em nosso portal, por favor, entre em contato conosco através da nossa página de Contato. Inclua o máximo de detalhes possível para que possamos corrigir o problema rapidamente.
                            </AccordionItemPanel>
                        </AccordionItem>
                    </Accordion>
                </motion.div>
            </div>
            <div vw-access-button className="active"></div>
            <div vw-plugin-wrapper>
                <div className="vw-plugin-top-wrapper"></div>
            </div>
        </div>
    );
};

export default Accessibility;