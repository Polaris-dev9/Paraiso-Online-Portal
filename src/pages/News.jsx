import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Search, Filter, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';

const News = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todas' },
    { id: 'politica', name: 'Política' },
    { id: 'economia', name: 'Economia' },
    { id: 'esportes', name: 'Esportes' },
    { id: 'cultura', name: 'Cultura' },
    { id: 'tecnologia', name: 'Tecnologia' }
  ];

  const news = [
    {
      id: 1,
      slug: 'nova-empresa-gera-empregos',
      title: "Nova empresa se instala na região gerando 200 empregos",
      excerpt: "Indústria tecnológica escolhe nossa cidade para expandir operações, prometendo revolucionar o mercado local com inovação e oportunidades de carreira...",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
      category: 'economia',
      date: "2025-09-08",
      author: "João Silva",
      featured: true
    },
    {
      id: 2,
      slug: 'festival-de-inverno-movimenta-economia',
      title: "Festival de inverno movimenta economia local",
      excerpt: "Evento cultural atrai milhares de visitantes e impulsiona turismo na região, gerando receita significativa para comerciantes locais...",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
      category: 'cultura',
      date: "2025-09-07",
      author: "Maria Santos",
      featured: true
    },
    {
      id: 3,
      slug: 'prefeitura-anuncia-obras',
      title: "Prefeitura anuncia obras de infraestrutura",
      excerpt: "Investimento de R$ 50 milhões em melhorias urbanas incluindo pavimentação, saneamento e modernização de equipamentos públicos...",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop",
      category: 'politica',
      date: "2025-09-06",
      author: "Carlos Oliveira",
      featured: false
    },
  ];

  const filteredNews = news.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredNews = filteredNews.filter(article => article.featured);
  const regularNews = filteredNews.filter(article => !article.featured);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Notícias e Blog - Portal Paraíso Online</title>
        <meta name="description" content="Fique por dentro das principais notícias e artigos. O Portal Paraíso Online traz as informações mais relevantes e atualizadas para você." />
        <meta name="keywords" content="notícias, são joão do paraíso, política, economia, esportes, cultura, tecnologia, blog" />
      </Helmet>

      <div className="container mx-auto px-4">
        <Breadcrumbs />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">
            📰 Notícias e Artigos
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fique por dentro das principais notícias e acontecimentos da região.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Buscar notícias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:w-auto"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {featuredNews.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
              ⭐ Em Destaque
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredNews.map((article) => (
                <Link to={`/noticia/${article.slug}`} key={article.id} className="block group">
                  <article className="bg-white rounded-lg shadow-lg overflow-hidden hover-lift h-full flex flex-col">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold self-start mb-3">
                        {categories.find(cat => cat.id === article.category)?.name}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto text-sm text-gray-500">
                        <div className="flex items-center">
                          <User size={14} className="mr-1" />{article.author}
                        </div>
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1" />{new Date(article.date).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            📄 Últimas Publicações
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularNews.map((article) => (
              <Link to={`/noticia/${article.slug}`} key={article.id} className="block group">
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover-lift h-full flex flex-col"
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 flex flex-col flex-grow">
                     <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-semibold self-start mb-2">
                        {categories.find(cat => cat.id === article.category)?.name}
                      </span>
                    <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2 flex-grow group-hover:text-blue-700 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                    <Button variant="link" className="p-0 h-auto self-start text-blue-600">Leia mais</Button>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        </motion.section>

        {filteredNews.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma notícia encontrada</h3>
            <p className="text-gray-600">Tente ajustar os filtros ou termos de busca.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default News;