import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Rss, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const Blog = () => {
    const { toast } = useToast();

    const posts = [
        {
            id: 1,
            title: '5 Dicas de Marketing Digital para Pequenas Empresas Locais',
            category: 'Marketing',
            author: 'Equipe PPO',
            date: '20 de Agosto, 2025',
            excerpt: 'Descubra estratégias simples e eficazes para aumentar a visibilidade do seu negócio na internet e atrair mais clientes na sua região.',
            image: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=800&h=400&fit=crop'
        },
        {
            id: 2,
            title: 'A Importância de uma Vitrine Online para o Comércio Tradicional',
            category: 'E-commerce',
            author: 'Equipe PPO',
            date: '15 de Agosto, 2025',
            excerpt: 'Entenda por que ter uma presença online, como uma loja no ParaísoShop, é crucial para o sucesso do comércio físico nos dias de hoje.',
            image: 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?w=800&h=400&fit=crop'
        },
        {
            id: 3,
            title: 'Como Coletar e Usar Depoimentos de Clientes para Vender Mais',
            category: 'Vendas',
            author: 'Equipe PPO',
            date: '10 de Agosto, 2025',
            excerpt: 'Aprenda a transformar a satisfação dos seus clientes em uma poderosa ferramenta de marketing e prova social para o seu negócio.',
            image: 'https://images.unsplash.com/photo-1556742212-0b2804f6a62f?w=800&h=400&fit=crop'
        },
    ];
    
    const handleAction = (id) => {
        toast({
            title: 'Redirecionando...',
            description: 'Você será levado para a página completa da notícia.',
        });
        // This would navigate to /noticia/:id in a real app
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Helmet>
                <title>Blog - Dicas para o seu Negócio - Portal Paraíso Online</title>
                <meta name="description" content="Conteúdo e dicas para ajudar empresas e profissionais de São João do Paraíso a crescerem e se destacarem no mercado." />
            </Helmet>

            <div className="container mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4 flex items-center justify-center">
                        <Rss className="mr-3" /> Blog do Empreendedor
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Dicas e insights para alavancar seu negócio em São João do Paraíso.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <main className="lg:col-span-2">
                        <div className="space-y-12">
                           {posts.map((post) => (
                               <motion.div 
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ duration: 0.5 }}
                                className="bg-white rounded-lg shadow-lg overflow-hidden group"
                               >
                                   <Link to={`/noticia/${post.id}`}>
                                     <img src={post.image} alt={post.title} className="w-full h-64 object-cover" />
                                   </Link>
                                   <div className="p-8">
                                       <p className="text-sm text-blue-600 font-semibold mb-2">{post.category}</p>
                                       <Link to={`/noticia/${post.id}`}>
                                         <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-800 transition-colors">{post.title}</h2>
                                       </Link>
                                       <div className="text-xs text-gray-500 mb-4">
                                            <span>Por {post.author}</span> | <span>{post.date}</span>
                                       </div>
                                       <p className="text-gray-700 leading-relaxed mb-6">{post.excerpt}</p>
                                       <Button asChild>
                                           <Link to={`/noticia/${post.id}`}>Ler Artigo Completo</Link>
                                       </Button>
                                   </div>
                               </motion.div>
                           ))}
                        </div>
                    </main>
                    <aside className="lg:col-span-1">
                        <div className="sticky top-28 space-y-8">
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Buscar no Blog</h3>
                                <div className="relative">
                                    <Input placeholder="Pesquisar artigos..." className="pl-10"/>
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Categorias</h3>
                                <ul className="space-y-2">
                                    <li><Link to="/noticias/marketing" className="text-gray-700 hover:text-blue-600">Marketing</Link></li>
                                    <li><Link to="/noticias/ecommerce" className="text-gray-700 hover:text-blue-600">E-commerce</Link></li>
                                    <li><Link to="/noticias/vendas" className="text-gray-700 hover:text-blue-600">Vendas</Link></li>
                                    <li><Link to="/noticias/gestao" className="text-gray-700 hover:text-blue-600">Gestão</Link></li>
                                    <li><Link to="/noticias/financas" className="text-gray-700 hover:text-blue-600">Finanças</Link></li>
                                </ul>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Blog;