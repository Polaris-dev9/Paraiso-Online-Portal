import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Linkedin, Mic, Clapperboard, ExternalLink, Calendar, Camera, User, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';

const TikTokIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.84-.95-6.43-2.8-1.59-1.86-2.32-4.2-1.86-6.33.38-1.75 1.4-3.23 2.79-4.28 1.9-1.44 4.35-1.82 6.59-1.32.09 1.58.02 3.18.01 4.75-.68-.12-1.35-.2-2.03-.36-1.31-.31-2.58-.75-3.74-1.38v-4.02c1.11.45 2.34.79 3.57.97.03 1.6.02 3.21.02 4.81z" />
  </svg>
);

const PublicFigurePage = () => {
    const { slug } = useParams();
    const { toast } = useToast();
    const [figure, setFigure] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const mockData = {
            'julia-martins': {
                id: 1,
                name: 'Júlia Martins',
                title: 'Palestrante & Influenciadora Digital',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80',
                bio: 'Júlia Martins é uma renomada palestrante motivacional e influenciadora digital com mais de 1 milhão de seguidores. Com uma abordagem autêntica e inspiradora, ela ajuda pessoas a destravarem seu potencial máximo e alcançarem seus objetivos. Sua jornada começou de forma humilde, e hoje ela viaja o mundo compartilhando sua mensagem de resiliência e autoconfiança.',
                socials: [
                    { name: 'Instagram', url: '#', icon: Instagram },
                    { name: 'YouTube', url: '#', icon: Youtube },
                    { name: 'TikTok', url: '#', icon: TikTokIcon, className: 'w-5 h-5' },
                    { name: 'LinkedIn', url: '#', icon: Linkedin },
                ],
                gallery: [
                    'https://images.unsplash.com/photo-1557862921-37829c790f19?w=500&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=500&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=400&fit=crop',
                ],
                agenda: [
                    { date: '2025-11-10', event: 'Conferência Nacional de Liderança', location: 'São Paulo, SP' },
                    { date: '2025-11-25', event: 'Workshop "Destrave seu Potencial"', location: 'Online' },
                    { date: '2025-12-05', event: 'Palestra na Expo Empreender', location: 'Rio de Janeiro, RJ' },
                ],
                press: [
                    { type: 'interview', title: 'Entrevista para a Revista Forbes', link: '#', icon: Mic },
                    { type: 'video', title: 'Participação no PodPah', link: '#', icon: Clapperboard },
                    { type: 'article', title: 'Matéria no G1 sobre influência digital', link: '#', icon: ExternalLink },
                ]
            }
        };
        
        setTimeout(() => {
            setFigure(mockData[slug]);
            setLoading(false);
        }, 500);

    }, [slug]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast({
            title: '🔗 Link Copiado!',
            description: 'O link do perfil foi copiado para sua área de transferência.',
        });
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-gray-50"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div></div>;
    }

    if (!figure) {
        return <div className="text-center py-20">
            <h1 className="text-2xl font-bold">Personalidade não encontrada</h1>
            <Link to="/"><Button className="mt-4">Voltar para a Home</Button></Link>
        </div>;
    }

    const keywords = `${figure.name}, ${figure.title}, Personalidade Pública, São João do Paraíso, ${figure.socials.map(s => s.name).join(', ')}`;

    return (
        <div className="min-h-screen bg-gray-50">
            <Helmet>
                <title>{`${figure.name} - ${figure.title} | Portal Paraíso Online`}</title>
                <meta name="description" content={figure.bio.substring(0, 160)} />
                <meta name="keywords" content={keywords} />
                <meta property="og:title" content={`${figure.name} - ${figure.title}`} />
                <meta property="og:description" content={figure.bio.substring(0, 160)} />
                <meta property="og:image" content={figure.avatar} />
                <meta property="og:type" content="profile" />
            </Helmet>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-white shadow-md">
                    <div className="container mx-auto px-4 py-10">
                        <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-8">
                            <Avatar className="w-36 h-36 md:w-48 md:h-48 border-4 border-gold shadow-lg">
                                <AvatarImage src={figure.avatar} alt={figure.name} />
                                <AvatarFallback className="text-5xl">{figure.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow">
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{figure.name}</h1>
                                <p className="text-xl text-gold-dark font-semibold mt-1">{figure.title}</p>
                                <div className="flex justify-center md:justify-start gap-3 mt-4">
                                    {figure.socials.map(social => {
                                        const Icon = social.icon;
                                        return (
                                            <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors transform hover:scale-110">
                                                <Icon className={social.className || 'w-6 h-6'} />
                                            </a>
                                        )
                                    })}
                                </div>
                            </div>
                            <Button size="lg" variant="outline" onClick={handleShare} className="shrink-0">
                                <Share2 className="mr-2 h-5 w-5" /> Compartilhar
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 mt-8 pb-12">
                    <Tabs defaultValue="bio" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                            <TabsTrigger value="bio"><User className="mr-2 h-4 w-4" /> Biografia</TabsTrigger>
                            <TabsTrigger value="gallery"><Camera className="mr-2 h-4 w-4" /> Galeria</TabsTrigger>
                            <TabsTrigger value="agenda"><Calendar className="mr-2 h-4 w-4" /> Agenda</TabsTrigger>
                            <TabsTrigger value="press"><Mic className="mr-2 h-4 w-4" /> Imprensa</TabsTrigger>
                        </TabsList>

                        <TabsContent value="bio" className="mt-6">
                            <Card>
                                <CardHeader><CardTitle>Sobre {figure.name}</CardTitle></CardHeader>
                                <CardContent className="prose max-w-none text-lg text-gray-700 leading-relaxed">
                                    <p>{figure.bio}</p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="gallery" className="mt-6">
                            <Card>
                                <CardHeader><CardTitle>Galeria de Fotos</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {figure.gallery.map((img, index) => (
                                            <motion.div key={index} whileHover={{ scale: 1.05 }} className="rounded-lg overflow-hidden shadow-md">
                                                <img src={img} alt={`${figure.name} - foto ${index + 1}`} className="w-full h-48 object-cover" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="agenda" className="mt-6">
                            <Card>
                                <CardHeader><CardTitle>Agenda de Eventos</CardTitle></CardHeader>
                                <CardContent>
                                    <ul className="space-y-4">
                                        {figure.agenda.map((item, index) => (
                                            <li key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg border">
                                                <div className="text-center sm:text-left">
                                                    <p className="font-bold text-blue-600">{new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</p>
                                                    <p className="text-sm text-gray-500">{new Date(item.date).getFullYear()}</p>
                                                </div>
                                                <div className="border-l-2 border-blue-200 pl-4">
                                                    <p className="font-semibold text-gray-800">{item.event}</p>
                                                    <p className="text-sm text-gray-600">{item.location}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="press" className="mt-6">
                            <Card>
                                <CardHeader><CardTitle>Na Mídia</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {figure.press.map((item, index) => {
                                            const Icon = item.icon;
                                            return (
                                                <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
                                                    <div className="bg-blue-100 p-3 rounded-full">
                                                        <Icon className="w-6 h-6 text-blue-700" />
                                                    </div>
                                                    <span className="font-medium text-gray-800">{item.title}</span>
                                                    <ExternalLink className="w-5 h-5 text-gray-400 ml-auto" />
                                                </a>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </motion.div>
        </div>
    );
};

export default PublicFigurePage;