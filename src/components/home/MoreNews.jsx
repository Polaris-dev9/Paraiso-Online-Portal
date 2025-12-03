import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ReactPlayer from 'react-player/lazy';

const createDummyData = (count, baseTitle, imageBaseUrl) => {
  return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      title: `${baseTitle} ${i + 1}`,
      image: `${imageBaseUrl}?w=400&h=250&fit=crop&random=${i * count}`
  }));
};

const MoreNews = () => {
  const newsCategories = [
    { title: "Política", link: "/noticias/politica", data: createDummyData(3, "Política", "https://images.unsplash.com/photo-1534294668821-28a3054f435d") },
    { title: "Cultura", link: "/noticias/cultura", data: createDummyData(3, "Cultura", "https://images.unsplash.com/photo-1511795409834-ef04bbd61622") },
    { title: "Tecnologia", link: "/noticias/tecnologia", data: createDummyData(3, "Tecnologia", "https://images.unsplash.com/photo-1518770660439-4636190af475") },
  ];

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold text-blue-900 mb-6">Mais Notícias</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {newsCategories.map(category => (
                           <div key={category.title}>
                              <h3 className="text-xl font-bold text-blue-900 mb-4 border-b-2 border-blue-200 pb-2">{category.title}</h3>
                              <div className="space-y-3">
                                  <Link to={category.link} className="text-gray-700 hover:text-blue-700 block font-medium">{category.data[0].title}</Link>
                                  <Link to={category.link} className="text-gray-700 hover:text-blue-700 block font-medium">{category.data[1].title}</Link>
                                  <Link to={category.link} className="text-gray-700 hover:text-blue-700 block font-medium">{category.data[2].title}</Link>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
              <div>
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                      <h3 className="text-xl font-bold text-blue-900 mb-4">Canal PPO</h3>
                      <div className="relative mb-4">
                          <ReactPlayer
                              url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                              width="100%"
                              height="100%"
                              light={true}
                              playing={false}
                              controls={true}
                              className="aspect-video"
                          />
                      </div>
                      <h4 className="font-semibold mb-2">Último Vídeo: Como o Portal pode ajudar seu negócio</h4>
                      <p className="text-sm text-gray-600 mb-4">Descubra todas as ferramentas que oferecemos para impulsionar suas vendas.</p>
                      <Button className="w-full gradient-gold text-white">Inscreva-se no Canal</Button>
                  </div>
              </div>
          </div>
      </div>
    </section>
  );
};

export default MoreNews;