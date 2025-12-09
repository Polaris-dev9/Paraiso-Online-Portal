import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
    MapPin, Phone, Mail, Globe, Share2, Eye, 
    Clock, Building, MessageCircle, Facebook, 
    Instagram, Linkedin, Youtube, CheckCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { subscriberService } from '@/services/subscriberService';
import { categoryService } from '@/services/categoryService';
import { Loader2, AlertCircle } from 'lucide-react';

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
);

const SubscriberPublicPage = () => {
    const { slug } = useParams();
    const [subscriber, setSubscriber] = useState(null);
    const [categoryName, setCategoryName] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSubscriber = async () => {
            if (!slug) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                
                // Buscar assinante por slug
                const subscriberData = await subscriberService.getSubscriberBySlug(slug);
                
                if (!subscriberData) {
                    setLoading(false);
                    return;
                }

                // Verificar se está ativo
                if (!subscriberData.status) {
                    setLoading(false);
                    return;
                }

                setSubscriber(subscriberData);

                // Buscar nome da categoria
                if (subscriberData.category_id) {
                    try {
                        const category = await categoryService.getCategoryById(subscriberData.category_id);
                        if (category) {
                            setCategoryName(category.name);
                        }
                    } catch (error) {
                        console.error('Error fetching category:', error);
                    }
                }

                // Incrementar contador de visualizações (apenas uma vez por sessão)
                // Usar sessionStorage para garantir que não incrementa duas vezes mesmo em StrictMode
                const viewKey = `view_incremented_${subscriberData.id}`;
                if (!sessionStorage.getItem(viewKey) && subscriberData.id) {
                    sessionStorage.setItem(viewKey, 'true');
                    
                    try {
                        await subscriberService.incrementViews(subscriberData.id);
                        console.log('[SubscriberPublicPage] Views incremented for:', subscriberData.id);
                    } catch (error) {
                        console.error('Error incrementing views:', error);
                        // Remover do sessionStorage se falhar para permitir tentar novamente
                        sessionStorage.removeItem(viewKey);
                    }
                }

            } catch (error) {
                console.error('Error loading subscriber:', error);
            } finally {
                setLoading(false);
            }
        };

        loadSubscriber();
    }, [slug]);

    const handleShare = async () => {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({
                    title: subscriber?.name || 'Empresa',
                    text: subscriber?.description || '',
                    url: url
                });
            } else {
                await navigator.clipboard.writeText(url);
                alert('Link copiado para a área de transferência!');
            }
        } catch (error) {
            // Usuário cancelou ou erro - silenciar
            if (error.name !== 'AbortError') {
                console.error('Error sharing:', error);
            }
        }
    };

    const formatPhone = (phone) => {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (cleaned.length === 10) {
            return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return phone;
    };

    const formatAddress = (address) => {
        if (!address || typeof address !== 'object') return '';
        const parts = [];
        if (address.street) parts.push(address.street);
        if (address.number) parts.push(address.number);
        if (address.neighborhood) parts.push(`- ${address.neighborhood}`);
        if (address.city) parts.push(address.city);
        if (address.state) parts.push(address.state);
        if (address.zip_code) parts.push(`CEP: ${address.zip_code}`);
        return parts.join(', ') || '';
    };

    const getWhatsAppUrl = (phone) => {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        return `https://wa.me/55${cleaned}`;
    };

    const getBusinessHours = (hours) => {
        if (!hours || typeof hours !== 'object' || Object.keys(hours).length === 0) {
            return 'Não informado';
        }
        
        const weekDays = {
            monday: 'Segunda-feira',
            tuesday: 'Terça-feira',
            wednesday: 'Quarta-feira',
            thursday: 'Quinta-feira',
            friday: 'Sexta-feira',
            saturday: 'Sábado',
            sunday: 'Domingo'
        };

        const formatted = Object.entries(hours).map(([day, time]) => {
            const dayName = weekDays[day] || day;
            return `${dayName}: ${time || 'Fechado'}`;
        });

        return formatted.join(' | ');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!subscriber) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Empresa não encontrada</h1>
                    <p className="text-gray-600 mb-4">Desculpe, não conseguimos encontrar a empresa que você está procurando.</p>
                    <Button asChild>
                        <Link to="/guia-comercial">Ver Guia Comercial</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const address = formatAddress(subscriber.address || {});
    const phone = formatPhone(subscriber.phone || '');
    const whatsappUrl = getWhatsAppUrl(subscriber.phone || '');
    const socialLinks = subscriber.social_links || {};

    return (
        <div className="min-h-screen bg-gray-50">
            <Helmet>
                <title>{`${subscriber.name} | Portal Paraíso Online`}</title>
                <meta name="description" content={subscriber.description || `${subscriber.name} no Portal Paraíso Online`} />
                <meta property="og:title" content={subscriber.name} />
                <meta property="og:description" content={subscriber.description || ''} />
                <meta property="og:image" content={subscriber.banner_image_url || subscriber.profile_image_url || ''} />
                <meta property="og:type" content="website" />
            </Helmet>

            {/* Banner/Header */}
            <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
                {subscriber.banner_image_url ? (
                    <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${subscriber.banner_image_url})` }}
                    >
                        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                    </div>
                ) : null}
                
                <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
                    <div className="flex items-end gap-6 w-full">
                        {/* Avatar/Logo */}
                        <div className="relative">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden">
                                {subscriber.profile_image_url || subscriber.logo_url ? (
                                    <img 
                                        src={subscriber.profile_image_url || subscriber.logo_url} 
                                        alt={subscriber.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                                        <Building className="w-12 h-12 text-blue-600" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-white">
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">{subscriber.name}</h1>
                            {categoryName && (
                                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                                    {categoryName}
                                </Badge>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleShare}
                                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                            >
                                <Share2 className="w-4 h-4 mr-2" />
                                Compartilhar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        {subscriber.description && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sobre</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 whitespace-pre-line">{subscriber.description}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Contact Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações de Contato</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {phone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-blue-600" />
                                        <span className="text-gray-700">{phone}</span>
                                    </div>
                                )}
                                
                                {subscriber.email && (
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-blue-600" />
                                        <a 
                                            href={`mailto:${subscriber.email}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {subscriber.email}
                                        </a>
                                    </div>
                                )}

                                {address && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                                        <span className="text-gray-700">{address}</span>
                                    </div>
                                )}

                                {subscriber.business_hours && Object.keys(subscriber.business_hours).length > 0 && (
                                    <div className="flex items-start gap-3">
                                        <Clock className="w-5 h-5 text-blue-600 mt-1" />
                                        <div>
                                            <p className="font-medium text-gray-900 mb-1">Horário de Funcionamento</p>
                                            <p className="text-gray-700 text-sm">{getBusinessHours(subscriber.business_hours)}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Stats */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Eye className="w-5 h-5" />
                                    <span>{subscriber.views_count || 0} visualizações</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Entre em Contato</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {whatsappUrl && (
                                    <Button
                                        asChild
                                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        <a 
                                            href={whatsappUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <WhatsAppIcon />
                                            <span className="ml-2">WhatsApp</span>
                                        </a>
                                    </Button>
                                )}

                                {subscriber.email && (
                                    <a
                                        href={`mailto:${subscriber.email}?subject=Contato via Portal Paraíso Online`}
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
                                    >
                                        <Mail className="w-4 h-4 mr-2" />
                                        Enviar E-mail
                                    </a>
                                )}
                            </CardContent>
                        </Card>

                        {/* Social Media */}
                        {(socialLinks.instagram || socialLinks.facebook || socialLinks.linkedin || socialLinks.youtube) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Redes Sociais</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {socialLinks.instagram && (
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                            >
                                                <a 
                                                    href={socialLinks.instagram}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Instagram className="w-4 h-4" />
                                                </a>
                                            </Button>
                                        )}
                                        {socialLinks.facebook && (
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                            >
                                                <a 
                                                    href={socialLinks.facebook}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Facebook className="w-4 h-4" />
                                                </a>
                                            </Button>
                                        )}
                                        {socialLinks.linkedin && (
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                            >
                                                <a 
                                                    href={socialLinks.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Linkedin className="w-4 h-4" />
                                                </a>
                                            </Button>
                                        )}
                                        {socialLinks.youtube && (
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                            >
                                                <a 
                                                    href={socialLinks.youtube}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Youtube className="w-4 h-4" />
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Status */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-medium">Ativo</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriberPublicPage;

