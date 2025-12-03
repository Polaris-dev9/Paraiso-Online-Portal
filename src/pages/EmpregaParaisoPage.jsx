import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Briefcase, Building, FileText, UserPlus, Search, ArrowRight, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const EmpregaParaisoPage = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <Helmet>
                <title>Emprega Paraíso - Vagas e Currículos em São João do Paraíso</title>
                <meta name="description" content="O Emprega Paraíso conecta talentos e empresas em São João do Paraíso. Encontre vagas, cadastre seu currículo e impulsione sua carreira." />
            </Helmet>

            <header className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white text-center py-20">
                <div className="container mx-auto px-4">
                    <Briefcase size={64} className="mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Emprega Paraíso</h1>
                    <p className="text-xl max-w-3xl mx-auto">Conectando talentos e oportunidades em São João do Paraíso e região.</p>
                </div>
            </header>
            
            <div className="container mx-auto px-4 -mt-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="text-center p-6 shadow-xl hover-lift">
                        <UserPlus size={48} className="mx-auto text-blue-600 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800">Para Candidatos</h2>
                        <p className="text-gray-600 my-4">Encontre a vaga dos seus sonhos. Cadastre seu currículo e seja visto pelas melhores empresas.</p>
                        <Button asChild className="w-full gradient-button">
                            <Link to="/curriculos">Cadastrar Currículo <ArrowRight className="ml-2" size={16}/></Link>
                        </Button>
                    </Card>
                    <Card className="text-center p-6 shadow-xl hover-lift bg-blue-900 text-white">
                        <Search size={48} className="mx-auto text-yellow-400 mb-4" />
                        <h2 className="text-2xl font-bold">Buscar Vagas</h2>
                        <p className="text-gray-300 my-4">Explore centenas de oportunidades de emprego em diversas áreas. Sua próxima carreira começa aqui.</p>
                        <Button asChild className="w-full bg-yellow-400 text-blue-900 hover:bg-yellow-500">
                           <Link to="/vagas">Ver Vagas Abertas <ArrowRight className="ml-2" size={16}/></Link>
                        </Button>
                    </Card>
                    <Card className="text-center p-6 shadow-xl hover-lift">
                        <Building size={48} className="mx-auto text-blue-600 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800">Para Empresas</h2>
                        <p className="text-gray-600 my-4">Anuncie suas vagas e encontre os profissionais ideais com o auxílio da nossa IA.</p>
                        <Button asChild className="w-full gradient-button">
                            <Link to="/anuncie-aqui">Anunciar Vaga <ArrowRight className="ml-2" size={16}/></Link>
                        </Button>
                    </Card>
                </div>
            </div>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Nosso Diferencial Tecnológico</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <Card className="flex flex-col items-center text-center p-6">
                            <FileText size={40} className="text-green-500 mb-4" />
                            <h3 className="font-bold text-lg">Diagnóstico de Perfil Profissional (DPP)</h3>
                            <p className="text-gray-600">Ajudamos candidatos a identificar seus pontos fortes e áreas de desenvolvimento, aumentando suas chances.</p>
                        </Card>
                         <Card className="flex flex-col items-center text-center p-6">
                            <Bot size={40} className="text-blue-600 mb-4" />
                            <h3 className="font-bold text-lg">Matchmaking com IA</h3>
                            <p className="text-gray-600">Nossa inteligência artificial analisa currículos e vagas para encontrar o "match" perfeito, otimizando o processo seletivo.</p>
                        </Card>
                         <Card className="flex flex-col items-center text-center p-6">
                            <Building size={40} className="text-green-500 mb-4" />
                            <h3 className="font-bold text-lg">Diagnóstico de Perfil Empresarial (DPE)</h3>
                            <p className="text-gray-600">Para empresas assinantes, analisamos a cultura e as necessidades para encontrar o candidato ideal.</p>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EmpregaParaisoPage;