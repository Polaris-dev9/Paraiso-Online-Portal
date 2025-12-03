import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Building, MapPin, DollarSign, Clock, Briefcase, ChevronLeft, Send, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Breadcrumbs from '@/components/common/Breadcrumbs';

const JobDetails = () => {
    const { jobId } = useParams();
    const { toast } = useToast();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const allJobs = JSON.parse(localStorage.getItem('ppo_jobs')) || [];
        const foundJob = allJobs.find(j => j.id.toString() === jobId);
        
        setTimeout(() => {
            if (foundJob) {
                setJob(foundJob);
            }
            setLoading(false);
        }, 500);

    }, [jobId]);

    const handleApply = () => {
        toast({
            title: '✅ Candidatura enviada!',
            description: 'Sua candidatura para a vaga foi enviada. Boa sorte!',
        });
    };
    
    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast({
            title: '🔗 Link Copiado!',
            description: 'O link da vaga foi copiado para sua área de transferência.',
        });
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Carregando...</div>;
    }

    if (!job) {
        return <div className="text-center py-20">
            <h1 className="text-2xl font-bold">Vaga não encontrada</h1>
            <Link to="/vagas"><Button className="mt-4">Voltar para Vagas</Button></Link>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Helmet>
                <title>{job.title} em {job.company} - Portal Paraíso Online</title>
                <meta name="description" content={job.description} />
            </Helmet>
            <div className="container mx-auto px-4">
                <Breadcrumbs />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Card className="border-gray-300">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h1 className="text-3xl font-bold text-blue-900">{job.title}</h1>
                                            <p className="text-lg text-gray-600 mt-1">{job.company}</p>
                                        </div>
                                        <Link to="/vagas"><Button variant="outline"><ChevronLeft size={16} className="mr-2" /> Voltar</Button></Link>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500 pt-4">
                                        <span className="flex items-center"><MapPin size={16} className="mr-1" />{job.location}</span>
                                        <span className="flex items-center"><Briefcase size={16} className="mr-1" />{job.type}</span>
                                        <span className="flex items-center text-green-600 font-semibold"><DollarSign size={16} className="mr-1" />{job.salary}</span>
                                        <span className="flex items-center"><Clock size={16} className="mr-1" />Publicado em {new Date(job.postedDate).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose max-w-none">
                                        <h2 className="font-semibold text-xl mb-3">Descrição da Vaga</h2>
                                        <p>{job.description}</p>
                                        
                                        <h2 className="font-semibold text-xl mt-6 mb-3">Requisitos</h2>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {job.requirements.map((req, index) => <li key={index}>{req}</li>)}
                                        </ul>

                                        <h2 className="font-semibold text-xl mt-6 mb-3">Benefícios</h2>
                                         <ul className="list-disc pl-5 space-y-1">
                                            {job.benefits.map((ben, index) => <li key={index}>{ben}</li>)}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="lg:col-span-1">
                            <Card className="sticky top-24 border-gray-300">
                                <CardHeader>
                                    <CardTitle>Pronto para se candidatar?</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Button onClick={handleApply} className="w-full gradient-royal text-white" size="lg"><Send className="mr-2" /> Candidatar-se Agora</Button>
                                    <Button onClick={handleShare} variant="outline" className="w-full"><Share2 className="mr-2" /> Compartilhar Vaga</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default JobDetails;