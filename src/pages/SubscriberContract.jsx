import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FileText, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const SubscriberContract = () => {
    const { toast } = useToast();

    const handleAction = (action) => {
        toast({
            title: `Ação de Contrato`,
            description: `A funcionalidade de ${action} está em desenvolvimento.`,
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <Helmet>
                <title>Contrato do Assinante - Portal Paraíso Online</title>
                <meta name="description" content="Consulte os termos e condições do contrato de assinatura do Portal Paraíso Online." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="container mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4 flex items-center justify-center">
                        <FileText className="mr-3" /> Contrato do Assinante
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Termos e condições para os parceiros do Portal Paraíso Online.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-lg shadow-2xl p-8 lg:p-12 max-w-4xl mx-auto"
                >
                    <div className="prose prose-lg max-w-none">
                        <h2 className="text-blue-800">CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE PUBLICIDADE</h2>
                        <p><strong>CONTRATANTE:</strong> [Nome da Empresa/Profissional], doravante denominado(a) ASSINANTE.</p>
                        <p><strong>CONTRATADA:</strong> Paraiso Online Digital LTDA, CNPJ: 21.130.723/0001-85, doravante denominada PORTAL.</p>
                        
                        <h3>Cláusula 1ª - Do Objeto</h3>
                        <p>O presente contrato tem por objeto a prestação de serviços de publicidade e divulgação do ASSINANTE no site Portal Paraíso Online, conforme o plano de assinatura escolhido.</p>

                        <h3>Cláusula 2ª - Dos Planos e Serviços</h3>
                        <p>Os serviços variam conforme o plano (Gratuito, Essencial, Premium) e incluem, mas não se limitam a: criação de página personalizada, destaque em buscas, inclusão no Guia Comercial/Profissional, e, para o plano Premium, criação de loja virtual no ParaísoShop.</p>

                        <h3>Cláusula 3ª - Das Obrigações do Portal</h3>
                        <p>Manter o portal no ar, oferecer suporte técnico, garantir a visibilidade contratada e fornecer acesso ao painel do assinante para gerenciamento das informações.</p>

                        <h3>Cláusula 4ª - Das Obrigações do Assinante</h3>
                        <p>Fornecer informações verídicas e atualizadas, efetuar os pagamentos em dia e utilizar a plataforma de acordo com os Termos de Uso.</p>

                        <h3>Cláusula 5ª - Do Pagamento</h3>
                        <p>O pagamento será recorrente (mensal ou anual) de acordo com o plano escolhido. A falta de pagamento poderá acarretar na suspensão dos serviços.</p>

                        <h3>Cláusula 6ª - Da Vigência e Rescisão</h3>
                        <p>O contrato tem vigência enquanto a assinatura estiver ativa. Pode ser rescindido por qualquer uma das partes mediante aviso prévio de 30 dias. Não haverá reembolso por períodos já pagos.</p>

                        <p className="mt-8 text-center">E por estarem justos e contratados, assinam o presente instrumento em duas vias de igual teor e forma.</p>
                        <p className="text-center">São João do Paraíso, {new Date().toLocaleDateString('pt-BR')}.</p>
                    </div>

                    <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
                        <Button onClick={() => handleAction('Download')} size="lg" className="gradient-royal text-white">
                            <Download className="mr-2" /> Baixar em PDF
                        </Button>
                        <Button onClick={() => handleAction('Impressão')} size="lg" variant="outline">
                            <Printer className="mr-2" /> Imprimir Contrato
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SubscriberContract;