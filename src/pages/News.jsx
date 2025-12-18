import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Search, Filter, Clock, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { newsService } from '@/services/newsService';
import { categoryService } from '@/services/categoryService';

const News = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
    loadCategories();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      // Buscar apenas notícias publicadas
      const data = await newsService.getAllNews({ publishedOnly: true });
      console.log('[News.jsx] News loaded:', data);
      console.log('[News.jsx] News count:', data?.length || 0);
      setNews(data || []);
    } catch (error) {
      console.error('[News.jsx] Error loading news:', error);
      console.error('[News.jsx] Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategoriesByType('news', true);
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    }
  };

  const filteredNews = news.filter(article => {
    const matchesSearch = article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           article.category_id === selectedCategory ||
                           (selectedCategory !== 'all' && categories.find(c => c.id === selectedCategory && c.id === article.category_id));
    return matchesSearch && matchesCategory;
  });

  // Ordenar por data de publicação (mais recentes primeiro)
  const sortedNews = [...filteredNews].sort((a, b) => {
    const dateA = a.published_at ? new Date(a.published_at) : new Date(a.created_at);
    const dateB = b.published_at ? new Date(b.published_at) : new Date(b.created_at);
    return dateB - dateA;
  });

  // Notícias em destaque (primeiras 2)
  const featuredNews = sortedNews.slice(0, 2);
  const regularNews = sortedNews.slice(2);

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
                <option value="all">Todas</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
        {featuredNews.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
          <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
              <span className="mr-2 text-yellow-500">⭐</span> Em Destaque
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredNews.map((article) => {
                    const category = categories.find(cat => cat.id === article.category_id);
                    const date = article.published_at || article.created_at;
                    return (
                <Link to={`/noticia/${article.slug}`} key={article.id} className="block group h-full">
                  <article className="bg-white rounded-lg shadow-lg overflow-hidden hover-lift h-full flex flex-col border-t-4 border-blue-600">
                          {article.featured_image_url ? (
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                                src={article.featured_image_url}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                          ) : (
                            <div className="aspect-video w-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400">Sem imagem</span>
                            </div>
                          )}
                    <div className="p-5 flex flex-col flex-grow">
                            {category && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold self-start mb-3">
                                {category.name}
                      </span>
                            )}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {article.excerpt || article.content?.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 text-sm text-gray-500">
                        <div className="flex items-center">
                                <Clock size={14} className="mr-1" />
                                {date ? new Date(date).toLocaleDateString('pt-BR') : '-'}
                        </div>
                        <span className="text-blue-600 font-medium">Ler mais</span>
                      </div>
                    </div>
                  </article>
                </Link>
                    );
                  })}
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
                {regularNews.map((article) => {
                  const category = categories.find(cat => cat.id === article.category_id);
                  const date = article.published_at || article.created_at;
                  return (
              <Link to={`/noticia/${article.slug}`} key={article.id} className="block group h-full">
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover-lift h-full flex flex-col"
                >
                        {article.featured_image_url ? (
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                              src={article.featured_image_url}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                        ) : (
                          <div className="aspect-video w-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">Sem imagem</span>
                          </div>
                        )}
                  <div className="p-5 flex flex-col flex-grow">
                          {category && (
                     <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-semibold self-start mb-2">
                              {category.name}
                      </span>
                          )}
                    <h3 className="font-bold text-xl mb-2 text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {article.title}
                    </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {article.excerpt || article.content?.replace(/<[^>]*>/g, '').substring(0, 100) + '...'}
                          </p>
                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 text-sm text-gray-500">
                            <div className="flex items-center">
                                <Clock size={14} className="mr-1" />
                                {date ? new Date(date).toLocaleDateString('pt-BR') : '-'}
                            </div>
                            <span className="text-blue-600 font-medium">Ler mais</span>
                          </div>
                  </div>
                </motion.article>
              </Link>
                  );
                })}
          </div>
        </motion.section>

            {filteredNews.length === 0 && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma notícia encontrada</h3>
            <p className="text-gray-600">Tente ajustar os filtros ou termos de busca.</p>
          </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default News;