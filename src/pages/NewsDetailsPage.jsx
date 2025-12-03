import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar, User, Eye, MessageSquare, Share2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

const NewsDetailsPage = () => {
    const { slug } = useParams();
    const { toast } = useToast();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const allNews = [
            { id: 1, slug: 'nova-empresa-gera-empregos', title: "Nova empresa se instala na região gerando 200 empregos", excerpt: "Indústria tecnológica escolhe nossa cidade...", content: "O conteúdo completo da notícia sobre a nova empresa, detalhando os benefícios para a cidade, o tipo de indústria, e as expectativas de crescimento econômico. A matéria explora as vagas que serão abertas e como os moradores podem se candidatar.", image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=500&fit=crop", category: 'Economia', date: "2025-09-08", author: "João Silva", views: 1250, comments_count: 23, featured: true },
            { id: 2, slug: 'festival-de-inverno-movimenta-economia', title: "Festival de inverno movimenta economia local", excerpt: "Evento cultural atrai milhares de visitantes...", content: "Detalhes sobre o festival de inverno, incluindo a programação completa, entrevistas com organizadores e comerciantes locais, e o impacto positivo no turismo e na cultura da cidade.", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=500&fit=crop", category: 'Cultura', date: "2025-09-07", author: "Maria Santos", views: 890, comments_count: 15, featured: true },
            { id: 3, slug: 'prefeitura-anuncia-obras', title: "Prefeitura anuncia obras de infraestrutura", excerpt: "Investimento de R$ 50 milhões em melhorias urbanas...", content: "A notícia detalha o plano de obras da prefeitura, com mapas das áreas que serão beneficiadas, cronograma de execução e entrevistas com engenheiros e com o prefeito sobre a importância do projeto.", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=500&fit=crop", category: 'Política', date: "2025-09-06", author: "Carlos Oliveira", views: 2100, comments_count: 45, featured: false },
        ];
        const allComments = [
            { id: 1, newsId: 1, author: 'Carlos', avatar: 'https://i.pravatar.cc/150?u=carlos', text: 'Excelente notícia para a nossa cidade! Mais empregos são sempre bem-vindos.' },
            { id: 2, newsId: 1, author: 'Ana', avatar: 'https://i.pravatar.cc/150?u=ana', text: 'Alguém sabe como se candidatar para as vagas?' },
        ];

        const foundNews = allNews.find(n => n.slug === slug);
        
        setTimeout(() => {
            if (foundNews) {
                setNews(foundNews);
                setComments(allComments.filter(c => c.newsId === foundNews.id));
            }
            setLoading(false);
        }, 500);

    }, [slug]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast({ title: '🔗 Link Copiado!', description: 'O link da notícia foi copiado.' });
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        
        toast({
            title: '💬 Comentário Enviado!',
            description: 'Seu comentário foi enviado para moderação. Obrigado por participar!',
        });
        setNewComment('');
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Carregando...</div>;
    if (!news) return <div className="text-center py-20"><h1 className="text-2xl font-bold">Notícia não encontrada</h1><Link to="/noticias"><Button className="mt-4">Voltar para Notícias</Button></Link></div>;

    const keywords = `${news.title.split(' ').join(', ')}, ${news.category}, notícias, São João do Paraíso`;

    return (
        <div className="min-h-screen bg-white py-12">
            <Helmet>
                <title>{`${news.title} | Portal Paraíso Online`}</title>
                <meta name="description" content={news.excerpt} />
                <meta name="keywords" content={keywords} />
                <meta property="og:title" content={news.title} />
                <meta property="og:description" content={news.excerpt} />
                <meta property="og:image" content={news.image} />
                <meta property="og:type" content="article" />
            </Helmet>
            <div className="container mx-auto px-4">
                <Breadcrumbs />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <article className="lg:col-span-2">
                            <div className="mb-6">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">{news.category}</span>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">{news.title}</h1>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500 mt-4 text-sm">
                                    <span className="flex items-center"><Calendar size={14} className="mr-1.5" /> {new Date(news.date).toLocaleDateString('pt-BR')}</span>
                                    <span className="flex items-center"><User size={14} className="mr-1.5" /> {news.author}</span>
                                    <span className="flex items-center"><Eye size={14} className="mr-1.5" /> {news.views} visualizações</span>
                                    <span className="flex items-center"><MessageSquare size={14} className="mr-1.5" /> {news.comments_count} comentários</span>
                                </div>
                            </div>
                            <img src={news.image} alt={news.title} className="w-full rounded-lg shadow-lg mb-8" />
                            <div className="prose max-w-none text-lg text-gray-800 leading-relaxed">
                                <p className="font-semibold text-xl">{news.excerpt}</p>
                                <p>{news.content}</p>
                            </div>
                        </article>
                        <aside className="lg:col-span-1 space-y-8 sticky top-24">
                            <Card>
                                <CardHeader><CardTitle>Compartilhe</CardTitle></CardHeader>
                                <CardContent>
                                    <Button onClick={handleShare} variant="outline" className="w-full"><Share2 className="mr-2" /> Compartilhar Notícia</Button>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>Comentários ({comments.length})</CardTitle></CardHeader>
                                <CardContent>
                                    <form onSubmit={handleCommentSubmit} className="space-y-4 mb-6">
                                        <Textarea placeholder="Deixe seu comentário..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                                        <Button type="submit" className="w-full gradient-royal text-white"><Send className="mr-2" /> Enviar Comentário</Button>
                                    </form>
                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                        {comments.map(comment => (
                                            <div key={comment.id} className="flex items-start gap-3">
                                                <Avatar><AvatarImage src={comment.avatar} /><AvatarFallback>{comment.author.charAt(0)}</AvatarFallback></Avatar>
                                                <div className="bg-gray-100 rounded-lg p-3 flex-1">
                                                    <p className="font-semibold text-sm">{comment.author}</p>
                                                    <p className="text-sm text-gray-700">{comment.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {comments.length === 0 && <p className="text-sm text-gray-500 text-center">Seja o primeiro a comentar!</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </aside>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default NewsDetailsPage;