import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { BookOpen, Key, Users, Building2, User2 as UserTie, ShoppingCart, Info, Lightbulb, ShieldCheck } from 'lucide-react';

const AdminTraining = () => {
    const trainingSections = [
        {
            icon: ShieldCheck,
            title: "Acessos e Segurança",
            content: [
                "Cada membro da equipe deve ter seu próprio login e senha, criados na seção 'Equipe e Permissões'.",
                "A senha de acesso padrão para novas contas de assinantes é '@32157'. Oriente o cliente a alterá-la no primeiro login para garantir sua segurança.",
                "Nunca compartilhe credenciais de acesso. Todas as ações ficam registradas por usuário.",
                "Sempre utilize a autenticação de dois fatores quando disponível para proteger as contas."
            ]
        },
        {
            icon: Building2,
            title: "Gerenciando o Guia Comercial",
            content: [
                "Para adicionar uma nova empresa, acesse 'Guia Comercial' e clique em 'Adicionar Empresa'.",
                "Preencha todos os campos com atenção, especialmente categoria e subcategoria, para garantir que a empresa seja encontrada.",
                "Métricas de visualizações e cliques são atualizadas em tempo real. Utilize esses dados para mostrar o valor do portal ao cliente.",
                "O plano 'Premium' garante o topo das listagens. O 'Essencial' fica acima do 'Gratuito'."
            ]
        },
        {
            icon: UserTie,
            title: "Gerenciando o Guia Profissional",
            content: [
                "O processo é similar ao Guia Comercial, mas focado em profissionais liberais.",
                "Incentive os profissionais a preencherem completamente seus perfis para maior destaque.",
            ]
        },
        {
            icon: Users,
            title: "Processo de Venda para Consultores",
            content: [
                "Apresente o portal focando na visibilidade local e no público-alvo qualificado.",
                "Utilize os dados do 'Dashboard Principal' para mostrar o alcance e engajamento do portal.",
                "Explique a diferença entre os planos: Gratuito (básico), Essencial (presença digital completa) e Premium (domínio de mercado com loja virtual).",
                "Ofereça o desconto de 10% para pagamento PIX como um benefício imediato."
            ]
        },
        {
            icon: ShoppingCart,
            title: "Marketplace ParaísoShop",
            content: [
                "Apenas assinantes do plano Premium podem ter uma loja no marketplace.",
                "Auxilie o assinante a cadastrar seus primeiros produtos e configurar sua loja.",
                "Explique a importância de boas fotos e descrições detalhadas para aumentar as vendas.",
            ]
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Helmet>
                <title>Admin: Treinamento - Portal Paraíso Online</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-blue-900 flex items-center">
                        <BookOpen className="mr-4" /> Treinamento Interno da Equipe
                    </h1>
                    <p className="text-gray-600 mt-2">Um guia completo com processos e informações essenciais para a administração do portal.</p>
                </div>

                <div className="space-y-8">
                    {trainingSections.map((section, index) => {
                        const Icon = section.icon;
                        return (
                            <motion.div
                                key={section.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-lg shadow-lg p-8"
                            >
                                <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
                                    <Icon className="mr-3 text-blue-600" /> {section.title}
                                </h2>
                                <ul className="space-y-3">
                                    {section.content.map((item, i) => (
                                        <li key={i} className="flex items-start">
                                            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                                            <p className="text-gray-700">{item}</p>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        );
                    })}
                </div>
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: trainingSections.length * 0.1 }}
                    className="mt-8 bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-6 rounded-r-lg"
                >
                     <h3 className="font-bold flex items-center mb-2"><Lightbulb className="mr-2"/> Dica de Ouro</h3>
                     <p>Utilize esta página como um manual de consulta rápida para garantir a padronização e a qualidade dos processos em toda a equipe. Manter este documento atualizado é responsabilidade de todos!</p>
                 </motion.div>
            </motion.div>
        </div>
    );
};

export default AdminTraining;