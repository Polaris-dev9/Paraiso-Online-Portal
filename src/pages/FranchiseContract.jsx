import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FileText, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const FranchiseContract = () => {
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
                <title>Contrato da Franquia - Portal Paraíso Online</title>
                <meta name="description" content="Consulte os termos e condições do contrato de franquia do Portal Paraíso Online." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="container mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4 flex items-center justify-center">
                        <FileText className="mr-3" /> Contrato da Franquia
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Termos e condições para se tornar um franqueado do Portal Paraíso Online.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-lg shadow-2xl p-8 lg:p-12 max-w-4xl mx-auto"
                >
                    <div className="prose prose-lg max-w-none">
                        <h2 className="text-blue-800">CONTRATO DE FRANQUIA EMPRESARIAL (Franchising)</h2>
                        <p><strong>FRANQUEADORA:</strong> Paraiso Online Digital LTDA, CNPJ: 21.130.723/0001-85.</p>
                        <p><strong>FRANQUEADO(A):</strong> [Nome do Franqueado], CPF/CNPJ: [Número do Documento].</p>
                        
                        <h3>Cláusula 1ª - Do Objeto</h3>
                        <p>A FRANQUEADORA concede ao FRANQUEADO o direito de uso da marca "Portal Paraíso Online" e do sistema de negócio para operar uma unidade de franquia na cidade de [Cidade do Franqueado], conforme as diretrizes estabelecidas no Manual da Franquia.</p>

                        <h3>Cláusula 2ª - Da Taxa de Franquia e Royalties</h3>
                        <p>O FRANQUEADO pagará à FRANQUEADORA a taxa inicial de franquia no valor de [Valor da Taxa]. Mensalmente, incidirá o pagamento de royalties correspondentes a [Percentual]% do faturamento bruto da unidade.</p>

                        <h3>Cláusula 3ª - Do Território</h3>
                        <p>O FRANQUEADO terá exclusividade de atuação no território do município de [Cidade do Franqueado].</p>

                        <h3>Cláusula 4ª - Das Obrigações da Franqueadora</h3>
                        <p>Fornecer treinamento inicial, manuais operacionais, suporte contínuo em marketing e gestão, e acesso à plataforma tecnológica do portal.</p>

                        <h3>Cláusula 5ª - Das Obrigações do Franqueado</h3>
                        <p>Seguir os padrões da marca, participar dos treinamentos, pagar as taxas em dia, e dedicar-se à gestão e crescimento da unidade local.</p>

                        <h3>Cláusula 6ª - Da Vigência</h3>
                        <p>O presente contrato terá vigência de 5 (cinco) anos, podendo ser renovado por igual período, mediante acordo entre as partes.</p>

                        <p className="mt-8 text-center">Este é um resumo do contrato. O documento completo (Circular de Oferta de Franquia - COF) será fornecido durante o processo de seleção.</p>
                    </div>

                    <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
                        <Button onClick={() => handleAction('Download')} size="lg" className="gradient-royal text-white">
                            <Download className="mr-2" /> Baixar Modelo
                        </Button>
                        <Button onClick={() => handleAction('Impressão')} size="lg" variant="outline">
                            <Printer className="mr-2" /> Imprimir
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default FranchiseContract;