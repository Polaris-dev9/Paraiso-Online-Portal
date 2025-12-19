import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, Newspaper, Calendar, Building2, User2 as UserTie, Loader2, FileText, Rss } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { newsService } from '@/services/newsService';
import { eventService } from '@/services/eventService';
import { subscriberService } from '@/services/subscriberService';
import Breadcrumbs from '@/components/common/Breadcrumbs';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState({
    news: [],
    events: [],
    companies: [],
    professionals: [],
    blog: [],
    loading: true
  });

  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setResults({ news: [], events: [], companies: [], professionals: [], blog: [], loading: false });
    }
  }, [query]);

  const performSearch = async (searchTerm) => {
    setResults(prev => ({ ...prev, loading: true }));
    
    try {
      // Search blog posts from localStorage
      const blogPosts = JSON.parse(localStorage.getItem('ppo_blog_posts') || '[]');
      const blogResults = blogPosts.filter(post => {
        const searchLower = searchTerm.toLowerCase();
        return (
          (post.title && post.title.toLowerCase().includes(searchLower)) ||
          (post.content && post.content.toLowerCase().includes(searchLower)) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(searchLower)) ||
          (post.category && post.category.toLowerCase().includes(searchLower))
        );
      }).slice(0, 10);

      // Search professionals from localStorage (since Professionals.jsx uses localStorage)
      const localStorageProfessionals = JSON.parse(localStorage.getItem('ppo_professionals') || '[]');
      const localStorageProfessionalsResults = localStorageProfessionals.filter(prof => {
        if (!prof.status) return false;
        const searchLower = searchTerm.toLowerCase();
        return (
          (prof.name && prof.name.toLowerCase().includes(searchLower)) ||
          (prof.specialty && prof.specialty.toLowerCase().includes(searchLower)) ||
          (prof.description && prof.description.toLowerCase().includes(searchLower)) ||
          (prof.category && prof.category.toLowerCase().includes(searchLower))
        );
      }).slice(0, 10);

      // Search in parallel
      const [newsData, eventsData, allSubscribers] = await Promise.all([
        newsService.getAllNews({ search: searchTerm, publishedOnly: true, limit: 10 }).catch(() => []),
        eventService.getAllEvents({ search: searchTerm, publishedOnly: true, limit: 10 }).catch(() => []),
        subscriberService.getAllSubscribers({ search: searchTerm, status: true, limit: 30 }).catch(() => [])
      ]);

      // Filter subscribers by type - the search already includes name, email, description
      const companies = (allSubscribers || []).filter(s => {
        const isCommercial = s.subscriber_type === 'commercial' || 
                           s.profile_type === 'commercial' || 
                           s.profile_type === 'empresarial';
        return isCommercial;
      }).slice(0, 10);

      // Professionals from database
      const dbProfessionals = (allSubscribers || []).filter(s => {
        const isProfessional = s.subscriber_type === 'professional' || 
                              s.profile_type === 'professional' ||
                              s.profile_type === 'profissional';
        return isProfessional;
      });

      // Combine database professionals with localStorage professionals
      // Convert localStorage format to match database format for consistency
      const formattedLocalStorageProfessionals = localStorageProfessionalsResults.map(prof => ({
        id: prof.id || `local-${prof.slug}`,
        name: prof.name,
        slug: prof.slug,
        description: prof.description,
        profile_image_url: prof.avatar,
        specialties: prof.specialty ? [prof.specialty] : [],
        profile_type: 'profissional',
        source: 'localStorage'
      }));

      const professionals = [...dbProfessionals, ...formattedLocalStorageProfessionals].slice(0, 10);

      setResults({
        news: newsData || [],
        events: eventsData || [],
        companies,
        professionals,
        blog: blogResults,
        loading: false
      });
    } catch (error) {
      console.error('Error performing search:', error);
      setResults(prev => ({ ...prev, loading: false }));
    }
  };

  const totalResults = results.news.length + results.events.length + results.companies.length + results.professionals.length + results.blog.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>{query ? `Busca: "${query}" | Portal Paraíso Online` : 'Busca | Portal Paraíso Online'}</title>
        <meta name="description" content={`Resultados da busca por "${query}" no Portal Paraíso Online`} />
      </Helmet>

      <div className="container mx-auto px-4">
        <Breadcrumbs />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Search className="text-blue-600" size={32} />
              Resultados da Busca
            </h1>
            {query && (
              <p className="text-lg text-gray-600">
                Buscando por: <span className="font-semibold text-blue-600">"{query}"</span>
              </p>
            )}
            {!query && (
              <p className="text-lg text-gray-600">Digite um termo de busca para começar.</p>
            )}
          </div>

          {results.loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Buscando...</span>
            </div>
          ) : query ? (
            <>
              {totalResults === 0 ? (
                <Card className="border-gray-200">
                  <CardContent className="py-12 text-center">
                    <Search className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum resultado encontrado</h3>
                    <p className="text-gray-600">
                      Não encontramos resultados para <span className="font-semibold">"{query}"</span>.
                      <br />
                      Tente usar termos diferentes ou verifique a ortografia.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-8">
                  {/* News Results */}
                  {results.news.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Newspaper className="text-blue-600" size={24} />
                        Notícias ({results.news.length})
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.news.map((article) => (
                          <Link key={article.id} to={`/noticia/${article.slug}`}>
                            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                              {article.featured_image_url && (
                                <img 
                                  src={article.featured_image_url} 
                                  alt={article.title}
                                  className="w-full h-48 object-cover rounded-t-lg"
                                />
                              )}
                              <CardHeader>
                                <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt || article.content}</p>
                                {article.published_at && (
                                  <p className="text-xs text-gray-500 mt-2">
                                    {new Date(article.published_at).toLocaleDateString('pt-BR')}
                                  </p>
                                )}
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Events Results */}
                  {results.events.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar className="text-purple-600" size={24} />
                        Eventos ({results.events.length})
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.events.map((event) => (
                          <Link key={event.id} to={`/evento/${event.slug}`}>
                            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                              {event.featured_image_url && (
                                <img 
                                  src={event.featured_image_url} 
                                  alt={event.title}
                                  className="w-full h-48 object-cover rounded-t-lg"
                                />
                              )}
                              <CardHeader>
                                <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                                {event.start_date && (
                                  <p className="text-xs text-gray-500 mt-2">
                                    {new Date(event.start_date).toLocaleDateString('pt-BR')}
                                  </p>
                                )}
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Companies Results */}
                  {results.companies.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Building2 className="text-green-600" size={24} />
                        Empresas ({results.companies.length})
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.companies.map((company) => (
                          <Link key={company.id} to={company.slug ? `/empresa/${company.slug}` : `/guia-comercial`}>
                            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                              {company.profile_image_url && (
                                <img 
                                  src={company.profile_image_url} 
                                  alt={company.name}
                                  className="w-full h-48 object-cover rounded-t-lg"
                                />
                              )}
                              <CardHeader>
                                <CardTitle className="text-lg line-clamp-2">{company.name}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                {company.description && (
                                  <p className="text-sm text-gray-600 line-clamp-2">{company.description}</p>
                                )}
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Professionals Results */}
                  {results.professionals.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <UserTie className="text-orange-600" size={24} />
                        Profissionais ({results.professionals.length})
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.professionals.map((professional) => (
                          <Link key={professional.id} to={professional.slug ? `/guia-profissional/${professional.slug}` : `/guia-profissional`}>
                            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                              {professional.profile_image_url && (
                                <img 
                                  src={professional.profile_image_url} 
                                  alt={professional.full_name}
                                  className="w-full h-48 object-cover rounded-t-lg"
                                />
                              )}
                              <CardHeader>
                                <CardTitle className="text-lg line-clamp-2">{professional.name}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                {professional.specialties && Array.isArray(professional.specialties) && professional.specialties.length > 0 && (
                                  <p className="text-sm text-gray-600">{professional.specialties.join(', ')}</p>
                                )}
                                {professional.description && (
                                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">{professional.description}</p>
                                )}
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Blog Results */}
                  {results.blog.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Rss className="text-orange-600" size={24} />
                        Blog ({results.blog.length})
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.blog.map((post) => (
                          <Link key={post.id} to={`/blog#post-${post.id}`}>
                            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                              {post.image && (
                                <img 
                                  src={post.image} 
                                  alt={post.title}
                                  className="w-full h-48 object-cover rounded-t-lg"
                                />
                              )}
                              <CardHeader>
                                <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                {post.excerpt && (
                                  <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                  {post.category && (
                                    <Badge variant="outline">{post.category}</Badge>
                                  )}
                                  {post.date && (
                                    <span className="text-xs text-gray-500">{post.date}</span>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <Card className="border-gray-200">
              <CardContent className="py-12 text-center">
                <Search className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Digite um termo de busca</h3>
                <p className="text-gray-600">Use a barra de busca no topo da página para pesquisar.</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SearchResults;

