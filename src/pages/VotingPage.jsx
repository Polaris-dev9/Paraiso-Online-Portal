import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Award, CheckSquare, Users, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const VotingPage = () => {
    const categories = [
        { name: "Melhor Restaurante", icon: "🍽️" },
        { name: "Melhor Loja de Roupas", icon: "👕" },
        { name: "Profissional do Ano", icon: "👩‍💼" },
        { name: "Empresa Inovação", icon: "💡" },
        { name: "Melhor Atendimento", icon: "😊" },
        { name: "Personalidade do Ano", icon: "🌟" },
    ];
    
    const howToVote = [
        { title: "Vote no Portal", description: "Navegue pelas categorias e escolha seus favoritos diretamente aqui no site.", icon: CheckSquare },
        { title: "Vote nas Redes Sociais", description: "Fique de olho em nossas enquetes e posts oficiais no Instagram e Facebook.", icon: ThumbsUp },
        { title: "Vote Presencialmente", description: "Em breve, pontos de votação estarão disponíveis em locais parceiros pela cidade.", icon: Users },
    ]

    return (
        <div className="bg-gray-100 min-h-screen">
            <Helmet>
                <title>Votação - Melhores do Ano | Portal Paraíso Online</title>
                <meta name="description" content="Participe da votação 'Melhores do Ano' e ajude a eleger os destaques de São João do Paraíso em diversas categorias." />
            </Helmet>

            <header className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-center py-20">
                <div className="container mx-auto px-4">
                    <Award size={64} className="mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Melhores do Ano 2025</h1>
                    <p className="text-xl max-w-3xl mx-auto">Sua voz decide quem são os grandes destaques da nossa cidade!</p>
                </div>
            </header>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Categorias em Votação</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {categories.map(cat => (
                            <Link to="/melhores-do-ano" key={cat.name} className="block p-6 bg-white rounded-lg shadow text-center hover-lift">
                                <div className="text-4xl mb-3">{cat.icon}</div>
                                <p className="font-semibold text-gray-700">{cat.name}</p>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Button asChild size="lg" className="gradient-gold text-white font-bold">
                            <Link to="/melhores-do-ano">Ver todos os indicados e Votar</Link>
                        </Button>
                    </div>
                </div>
            </section>
            
            <section className="py-16 bg-blue-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Como Votar</h2>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {howToVote.map(item => {
                            const Icon = item.icon;
                            return (
                                <div key={item.title} className="text-center">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                        <Icon size={40} className="text-blue-600" />
                                    </div>
                                    <h3 className="font-bold text-xl text-gray-800 mb-2">{item.title}</h3>
                                    <p className="text-gray-600">{item.description}</p>
                                </div>
                            )
                        })}
                     </div>
                </div>
            </section>
        </div>
    );
};

export default VotingPage;