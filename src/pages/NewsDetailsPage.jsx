import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar, User, MessageSquare, Share2, Send, Loader2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { newsService } from '@/services/newsService';
import { categoryService } from '@/services/categoryService';
import { commentService } from '@/services/commentService';
import { useAuth } from '@/contexts/AuthContext';

const NewsDetailsPage = () => {
    const { slug } = useParams();
    const { toast } = useToast();
    const { user } = useAuth();
    const [news, setNews] = useState(null);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const hasIncrementedViews = useRef(false);

    useEffect(() => {
        // Reset flag when slug changes
        hasIncrementedViews.current = false;
        loadNews();
    }, [slug]);

    const loadNews = async () => {
        try {
            setLoading(true);
            const newsData = await newsService.getNewsBySlug(slug);
            
            if (newsData) {
                setNews(newsData);
                
                // Incrementar visualizações apenas uma vez por carregamento
                if (!hasIncrementedViews.current) {
                    hasIncrementedViews.current = true;
                    await newsService.incrementViews(newsData.id);
                }
                
                // Carregar comentários
                loadComments(newsData.id);
                
                // Carregar categoria se existir
                if (newsData.category_id) {
                    try {
                        const catData = await categoryService.getCategoryById(newsData.category_id);
                        setCategory(catData);
                    } catch (err) {
                        console.error('Error loading category:', err);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading news:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadComments = async (newsId) => {
        const data = await commentService.getComments('news', newsId);
        setComments(data);
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast({ title: '🔗 Link Copiado!', description: 'O link da notícia foi copiado.' });
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        
        const commentText = newComment.trim(); // Save the text before clearing
        const commentAuthorName = user?.user_metadata?.full_name || user?.name || 'Visitante';
        const tempCommentId = Date.now();
        
        try {
            setSubmittingComment(true);
            
            // Para confirmação visual imediata
            const tempComment = {
                id: tempCommentId,
                content: commentText,
                author_name: commentAuthorName,
                status: 'pending',
                created_at: new Date().toISOString()
            };

            // Adicionar ao estado local para confirmação instantânea
            setComments(prev => [tempComment, ...prev]);
            setNewComment(''); // Clear input after saving the text

            // Save to database
            await commentService.createComment({
                content: commentText,
                author_name: commentAuthorName,
                author_email: user?.email || '',
                target_type: 'news',
                target_id: news.id,
                user_id: user?.id
            });
            
            // Reload comments from database to get the real comment with proper ID
            await loadComments(news.id);
        
            toast({
                title: '💬 Comentário Enviado!',
                description: 'Seu comentário foi enviado para moderação e aparecerá em breve.',
            });
        } catch (error) {
            console.error('Error submitting comment:', error);
            // Remove the temporary comment if save failed
            setComments(prev => prev.filter(c => c.id !== tempCommentId));
            setNewComment(commentText); // Restore the text so user can try again
            toast({
                variant: "destructive",
                title: 'Erro',
                description: 'Não foi possível enviar seu comentário.',
            });
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }
    
    if (!news) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold">Notícia não encontrada</h1>
                <Link to="/noticias">
                    <Button className="mt-4">Voltar para Notícias</Button>
                </Link>
            </div>
        );
    }

    const date = news.published_at || news.created_at;
    const keywords = `${news.title.split(' ').join(', ')}, ${category?.name || ''}, notícias, São João do Paraíso`;

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
                                {category && (
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                                        {category.name}
                                    </span>
                                )}
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">{news.title}</h1>
                                {date && (
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500 mt-4 text-sm">
                                        <span className="flex items-center">
                                            <Calendar size={14} className="mr-1.5" /> 
                                            {new Date(date).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Banner Superior se existir */}
                            {news.banner_url && (
                                <div className="mb-8 rounded-xl overflow-hidden shadow-lg border">
                                    <img 
                                        src={news.banner_url} 
                                        alt="Banner" 
                                        className="w-full h-auto object-cover max-h-[400px]" 
                                    />
                                </div>
                            )}

                            {news.featured_image_url && !news.banner_url && (
                                <img 
                                    src={news.featured_image_url} 
                                    alt={news.title} 
                                    className="w-full rounded-lg shadow-lg mb-8" 
                                />
                            )}

                            <div className="prose max-w-none text-lg text-gray-800 leading-relaxed">
                                {news.excerpt && (
                                    <p className="font-semibold text-xl mb-4 border-l-4 border-blue-600 pl-4 py-1 bg-blue-50/50">{news.excerpt}</p>
                                )}
                                <div 
                                    className="whitespace-pre-wrap"
                                    dangerouslySetInnerHTML={{ 
                                        __html: news.content 
                                            ? news.content.replace(/\n/g, '<br />') 
                                            : '' 
                                    }} 
                                />
                            </div>

                            {/* Galeria de Fotos */}
                            {news.gallery_urls && news.gallery_urls.length > 0 && (
                                <div className="mt-12 space-y-4">
                                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        <ImageIcon className="text-blue-600" /> Galeria de Fotos
                                    </h3>
                                    <Separator className="bg-gray-200" />
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {news.gallery_urls.map((url, index) => (
                                            <motion.div 
                                                key={index} 
                                                whileHover={{ scale: 1.02 }}
                                                className="aspect-video rounded-lg overflow-hidden border shadow-sm cursor-pointer"
                                                onClick={() => window.open(url, '_blank')}
                                            >
                                                <img src={url} alt={`Galeria ${index + 1}`} className="w-full h-full object-cover" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Links Relacionados */}
                            {news.related_links && news.related_links.length > 0 && (
                                <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <LinkIcon className="text-blue-600" /> Veja Mais / Links Relacionados
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {news.related_links.map((link, index) => (
                                            <a 
                                                key={index} 
                                                href={link.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm group"
                                            >
                                                <LinkIcon size={16} className="mr-3 text-gray-400 group-hover:text-blue-500" />
                                                <span className="font-medium">{link.title || 'Link Externo'}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
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
                                        <Textarea 
                                            placeholder="Deixe seu comentário..." 
                                            value={newComment} 
                                            onChange={(e) => setNewComment(e.target.value)} 
                                            disabled={submittingComment}
                                        />
                                        <Button type="submit" className="w-full gradient-royal text-white" disabled={submittingComment}>
                                            {submittingComment ? <Loader2 className="animate-spin mr-2" size={16} /> : <Send className="mr-2" size={16} />}
                                            Enviar Comentário
                                        </Button>
                                    </form>
                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                        {comments.map(comment => (
                                            <div key={comment.id} className={`flex items-start gap-3 ${comment.status === 'pending' ? 'opacity-60' : ''}`}>
                                                <Avatar>
                                                    <AvatarImage src={comment.author_avatar} />
                                                    <AvatarFallback>{(comment.author_name || 'V').charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="bg-gray-100 rounded-lg p-3 flex-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <p className="font-semibold text-sm">{comment.author_name || 'Visitante'}</p>
                                                        {comment.status === 'pending' && (
                                                            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 rounded uppercase font-bold">Pendente</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-700">{comment.content}</p>
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
