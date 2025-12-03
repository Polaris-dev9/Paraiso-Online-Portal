import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, Share2, Award, Briefcase, Camera, Video, Send, Star, Phone, MessageCircle, Calendar, CheckCircle, Linkedin, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path><path d="M14.05 2.95A10 10 0 0 1 22 11.13M14.05 6.95A6 6 0 0 1 18 11.13"></path></svg>
);

const ProfessionalProfilePage = () => {
    const { slug } = useParams();
    const { toast } = useToast();
    const [professional, setProfessional] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const allProfessionals = JSON.parse(localStorage.getItem('ppo_professionals')) || [];
        const foundProfessional = allProfessionals.find(p => p.slug === slug);
        
        setTimeout(() => {
            if (foundProfessional) {
                setProfessional({
                    ...foundProfessional,
                    skills: foundProfessional.skills || ['Direito Civil', 'Consultoria Empresarial', 'Contratos', 'Litígio Estratégico'],
                    awards: foundProfessional.awards || [
                        { title: 'Advogado do Ano', year: '2023', issuer: 'Ordem dos Advogados do Brasil' },
                        { title: 'Top 5 em Direito Civil', year: '2022', issuer: 'Revista Jurídica Nacional' }
                    ],
                    portfolio: foundProfessional.portfolio || [
                        { title: 'Caso de Sucesso Imobiliário', description: 'Representação vitoriosa em disputa de propriedade de alto valor.', image: 'https://images.unsplash.com/photo-1589216532372-1c2a36790049?w=400&h=300&fit=crop' },
                        { title: 'Reestruturação Societária', description: 'Consultoria para fusão de duas grandes empresas do setor de tecnologia.', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop' }
                    ],
                    socials: foundProfessional.socials || [
                        { name: 'LinkedIn', url: '#', icon: Linkedin },
                        { name: 'Instagram', url: '#', icon: Instagram },
                        { name: 'Facebook', url: '#', icon: Facebook },
                    ]
                });
            }
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

    if (!professional) {
        return <div className="text-center py-20">
            <h1 className="text-2xl font-bold">Profissional não encontrado</h1>
            <Link to="/guia-profissional"><Button className="mt-4">Voltar para o Guia</Button></Link>
        </div>;
    }

    const keywords = `${professional.name}, ${professional.specialty}, ${professional.category}, Guia Profissional, São João do Paraíso, ${professional.skills.join(', ')}`;
    
    return (
        <div className="min-h-screen bg-gray-100">
            <Helmet>
                <title>{`${professional.name} - ${professional.specialty} | Portal Paraíso Online`}</title>
                <meta name="description" content={professional.description} />
                <meta name="keywords" content={keywords} />
                <meta property="og:title" content={`${professional.name} - ${professional.specialty}`} />
                <meta property="og:description" content={professional.description} />
                <meta property="og:image" content={professional.avatar} />
                <meta property="og:type" content="profile" />
            </Helmet>
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-white shadow-sm">
                    <div className="container mx-auto px-4 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                            <div className="flex flex-col items-center md:items-start text-center md:text-left col-span-1 md:col-span-2">
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-blue-500 shadow-lg">
                                        <AvatarImage src={professional.avatar} alt={professional.name} />
                                        <AvatarFallback className="text-4xl">{professional.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{professional.name}</h1>
                                        <p className="text-lg text-blue-600 font-semibold">{professional.specialty}</p>
                                        <p className="text-md text-gray-600 mt-2 max-w-xl">{professional.description}</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                                    {professional.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white w-full"><WhatsAppIcon /> Conversar no WhatsApp</Button>
                                <Button size="lg" variant="outline" className="w-full"><Mail className="mr-2 h-4 w-4" /> Enviar E-mail</Button>
                                <Button size="lg" variant="outline" className="w-full" onClick={handleShare}><Share2 className="mr-2 h-4 w-4" /> Compartilhar Perfil</Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 mt-8">
                    <Tabs defaultValue="services" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                            <TabsTrigger value="services"><Briefcase className="mr-2 h-4 w-4" /> Serviços</TabsTrigger>
                            <TabsTrigger value="portfolio"><Camera className="mr-2 h-4 w-4" /> Portfólio</TabsTrigger>
                            <TabsTrigger value="awards"><Award className="mr-2 h-4 w-4" /> Conquistas</TabsTrigger>
                            <TabsTrigger value="schedule"><Calendar className="mr-2 h-4 w-4" /> Agenda</TabsTrigger>
                            <TabsTrigger value="contact"><MessageCircle className="mr-2 h-4 w-4" /> Contato</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="services" className="mt-6">
                            <Card><CardHeader><CardTitle>Serviços Oferecidos</CardTitle></CardHeader><CardContent>
                                <ul className="space-y-3">
                                    {professional.services?.map((s, i) => <li key={i} className="flex items-center"><CheckCircle className="text-green-500 mr-3" size={20}/>{s}</li>) || <li>Nenhum serviço informado.</li>}
                                </ul>
                            </CardContent></Card>
                        </TabsContent>

                        <TabsContent value="portfolio" className="mt-6">
                            <Card><CardHeader><CardTitle>Portfólio de Trabalhos</CardTitle></CardHeader><CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {professional.portfolio.map((item, index) => (
                                        <div key={index} className="border rounded-lg overflow-hidden">
                                            <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                                            <div className="p-4">
                                                <h4 className="font-bold">{item.title}</h4>
                                                <p className="text-sm text-gray-600">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent></Card>
                        </TabsContent>

                        <TabsContent value="awards" className="mt-6">
                            <Card><CardHeader><CardTitle>Premiações e Certificados</CardTitle></CardHeader><CardContent>
                                <ul className="space-y-4">
                                    {professional.awards.map((award, index) => (
                                        <li key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                            <Award className="text-yellow-500" size={32} />
                                            <div>
                                                <p className="font-bold">{award.title} - {award.year}</p>
                                                <p className="text-sm text-gray-500">Emitido por: {award.issuer}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent></Card>
                        </TabsContent>

                        <TabsContent value="schedule" className="mt-6">
                            <Card><CardContent className="p-6 text-center text-gray-500">A funcionalidade de agendamento online está em desenvolvimento.</CardContent></Card>
                        </TabsContent>

                        <TabsContent value="contact" className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card>
                                    <CardHeader><CardTitle>Envie uma Mensagem</CardTitle><CardDescription>Sua mensagem será enviada diretamente para {professional.name}.</CardDescription></CardHeader>
                                    <CardContent className="space-y-4">
                                        <Input placeholder="Seu nome" />
                                        <Input type="email" placeholder="Seu e-mail" />
                                        <Textarea placeholder="Sua mensagem..." />
                                        <Button className="w-full"><Send size={16} className="mr-2"/> Enviar Mensagem</Button>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader><CardTitle>Informações de Contato</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-3"><Phone size={16} className="text-blue-500"/><span>(63) 91234-5678</span></div>
                                        <div className="flex items-center gap-3"><Mail size={16} className="text-blue-500"/><span>contato@anabeatriz.com</span></div>
                                        <div className="pt-4 border-t">
                                            <h4 className="font-semibold mb-3">Redes Sociais</h4>
                                            <div className="flex gap-4">
                                                {professional.socials.map(social => {
                                                    const Icon = social.icon;
                                                    return (
                                                        <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors">
                                                            <Icon size={20} />
                                                        </a>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </motion.div>
        </div>
    )
};

export default ProfessionalProfilePage;