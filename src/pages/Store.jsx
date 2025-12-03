import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ShoppingCart, Search, Store as StoreIcon, Tag, Grid, Heart, ZoomIn, CreditCard, Star, Package, Video, Image as Images, Palette, ChevronsRight, Ticket, Shirt, Utensils, Home, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from '@/components/ui/card';

const ParaisoShop = () => {
    const { toast } = useToast();

    const handleSearch = (e) => {
        e.preventDefault();
        toast({
            title: "🔍 Buscando produtos...",
            description: "Funcionalidade de busca em desenvolvimento. Em breve, você encontrará ofertas incríveis! 🚀",
        });
    };
    
    const handleCreateStore = () => {
        toast({
            title: "🚀 Comece seu Test Drive!",
            description: "Você será redirecionado para o painel de criação da sua loja. Suas alterações não serão públicas até a aprovação.",
        });
    }

    const featuredProducts = [
        { id: 1, name: 'Curso de Marketing Digital', price: 'Consulte', image: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=400&h=300&fit=crop', store: 'Paraíso Online Digital', rating: 4.9, reviews: 32 },
        { id: 2, name: 'Curso de Design Gráfico', price: 'Consulte', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop', store: 'Paraíso Online Digital', rating: 4.8, reviews: 25 },
        { id: 3, name: 'Artesanato Local', price: 'R$ 59,90', image: 'https://images.unsplash.com/photo-1572099605299-a35e4933a35b?w=400&h=300&fit=crop', store: 'Casa do Artesão', rating: 5.0, reviews: 54 },
        { id: 4, name: 'Vestido Floral Elegance', price: 'R$ 249,90', image: 'https://images.unsplash.com/photo-1595536422325-e5b8c983997b?w=400&h=300&fit=crop', store: 'Moda & Estilo Boutique', rating: 4.7, reviews: 18 },
    ];
    
    const featuredStores = [
        { id: 1, name: 'Paraíso Online Digital', logo: '🎓', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=300&fit=crop', link: '/parceiro/paraiso-online-digital' },
        { id: 2, name: 'Casa do Artesão', logo: '🏺', image: 'https://images.unsplash.com/photo-1532386236358-a4a17a251d8b?w=600&h=300&fit=crop', link: '/parceiro/exemplo' },
        { id: 3, name: 'Moda & Estilo', logo: '👗', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=300&fit=crop', link: '/parceiro/exemplo' },
        { id: 4, name: 'Supermercado Preço Bom', logo: '🛒', image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&h=300&fit=crop', link: '/parceiro/exemplo' },
    ];

    const storeFeatures = [
        { icon: Palette, title: "Loja Personalizável", description: "Use suas cores e logo para uma loja com a sua cara." },
        { icon: Package, title: "Gestão de Produtos", description: "Cadastre, edite e gerencie seu inventário facilmente." },
        { icon: Images, title: "Múltiplas Imagens", description: "Mostre seus produtos de todos os ângulos com até 5 fotos." },
        { icon: Video, title: "Vídeo Review", description: "Incorpore vídeos do YouTube para apresentar seus produtos." },
        { icon: CreditCard, title: "Pagamento Online", description: "Integração com as principais formas de pagamento online." },
        { icon: Star, title: "Sistema de Avaliação", description: "Construa confiança com avaliações de clientes." },
    ]

    const categories = [
        { name: 'Categorias', icon: Grid }, { name: 'Ofertas', icon: Tag }, { name: 'Cupons', icon: Ticket },
        { name: 'Supermercado', icon: ShoppingCart }, { name: 'Moda', icon: Shirt }, { name: 'Restaurantes', icon: Utensils },
        { name: 'Casa & Lar', icon: Home }, { name: 'Vender', icon: StoreIcon }, { name: 'Favoritos', icon: Heart }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Helmet>
                <title>ParaísoShop - Marketplace do Portal Paraíso Online</title>
                <meta name="description" content="ParaísoShop – Seu paraíso de compras online! Tudo que você precisa em um só lugar. Compre de lojas locais e apoie o comércio da nossa cidade." />
            </Helmet>

            <div className="container mx-auto px-4">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-6">
                    <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-2">
                       <span className="text-gradient-gold">Paraíso</span>Shop
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Seu paraíso de compras online! Tudo que você precisa em um só lugar.
                    </p>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mb-12">
                     <Carousel
                        plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
                        opts={{ loop: true, align: "start" }}
                        className="w-full"
                    >
                        <CarouselContent>
                            {featuredStores.map(store => (
                                <CarouselItem key={store.id}>
                                    <Link to={store.link}>
                                        <div className="relative h-48 md:h-64 rounded-lg overflow-hidden">
                                            <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-tr from-black/70 to-transparent p-6 flex flex-col justify-end">
                                                <h3 className="text-2xl md:text-3xl font-bold text-white">{store.name}</h3>
                                                <p className="text-white/90">Clique e conheça a loja {store.logo}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-4" />
                        <CarouselNext className="right-4" />
                    </Carousel>
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-lg shadow-lg p-3 sm:p-4 mb-8 sticky top-[110px] z-40"
                >
                    <div className="flex items-center justify-between overflow-x-auto no-scrollbar">
                        {categories.map(category => (
                            <Button key={category.name} variant="ghost" className="flex-shrink-0 flex flex-col sm:flex-row items-center h-auto sm:h-10 px-2 sm:px-4 space-y-1 sm:space-y-0 sm:space-x-2 text-gray-600 hover:bg-blue-50 hover:text-blue-700">
                                <category.icon size={20} />
                                <span className="text-xs sm:text-sm">{category.name}</span>
                            </Button>
                        ))}
                    </div>
                </motion.div>


                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-blue-800">Produtos em Destaque</h2>
                        <Button variant="link" className="text-blue-700">Ver todos <ChevronsRight size={16} /></Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map(product => (
                             <Card as={motion.div} key={product.id} whileHover={{ y: -5 }} className="bg-white rounded-lg shadow-md overflow-hidden group border-0">
                                <CardContent className="p-0">
                                <Link to="/loja" className="block">
                                    <div className="relative overflow-hidden">
                                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                                        <Button size="icon" variant="ghost" className="absolute top-2 right-2 bg-white/70 backdrop-blur-sm rounded-full hover:bg-white text-gray-600 hover:text-red-500"><Heart size={18} /></Button>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-xs text-gray-500 mb-1">{product.store}</p>
                                        <h3 className="font-bold text-lg text-gray-900 truncate mb-2">{product.name}</h3>
                                        <div className="flex items-center mb-3">
                                            <div className="flex text-yellow-400">
                                               {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < Math.round(product.rating) ? 'fill-current' : 'text-gray-300'} /> )}
                                            </div>
                                            <span className="text-xs text-gray-500 ml-2">({product.reviews} avaliações)</span>
                                        </div>
                                        <p className="text-xl font-bold text-blue-700 mb-4">{product.price}</p>
                                        <div className="flex space-x-2">
                                             <Button className="w-full gradient-royal text-white">Comprar</Button>
                                             <Button variant="outline" size="icon"><ZoomIn size={18}/></Button>
                                        </div>
                                    </div>
                                </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </motion.div>

                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-xl p-8 my-16 text-white text-center"
                 >
                    <h2 className="text-3xl font-bold mb-4">Monte sua Loja Virtual no ParaísoShop!</h2>
                    <p className="max-w-3xl mx-auto mb-2">Assinantes Premium podem criar uma loja completa. Comece com o nosso 'Test Drive'!</p>
                    <p className="max-w-3xl mx-auto mb-8 text-sm text-blue-200 flex items-center justify-center"><EyeOff className="mr-2" size={16}/>Sua loja ficará visível apenas para você até a aprovação final.</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
                       {storeFeatures.map(feature => {
                           const Icon = feature.icon;
                           return (
                             <div key={feature.title} className="flex flex-col items-center text-center">
                               <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3">
                                   <Icon size={32} className="text-yellow-300" />
                               </div>
                               <span className="font-semibold text-sm">{feature.title}</span>
                             </div>
                           )
                       })}
                    </div>
                     <Link to="/admin/loja">
                        <Button onClick={handleCreateStore} className="bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-300 text-lg px-8 py-3">Iniciar Test Drive da Minha Loja</Button>
                    </Link>
                 </motion.div>
                
            </div>
        </div>
    );
};

export default ParaisoShop;