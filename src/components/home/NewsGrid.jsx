import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NewsGrid = () => {
    const createDummyNews = (category, count) => Array.from({ length: count }, (_, i) => ({
        id: `${category}-${i + 1}`,
        slug: `${category.toLowerCase().replace(/ /g, '-')}-noticia-${i + 1}`,
        title: `${category} - Notícia ${i + 1}`,
    }));

    const categories = [
        {
            title: "Saúde",
            news: createDummyNews("Saúde", 3),
            link: "/noticias/saude",
            image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400&h=250&fit=crop&q=80"
        },
        {
            title: "Esportes",
            news: createDummyNews("Esportes", 3),
            link: "/noticias/esportes",
            image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=250&fit=crop&q=80"
        },
        {
            title: "Educação",
            news: createDummyNews("Educação", 3),
            link: "/noticias/educacao",
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=250&fit=crop&q=80"
        },
        {
            title: "Economia",
            news: createDummyNews("Economia", 3),
            link: "/noticias/economia",
            image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=250&fit=crop&q=80"
        },
        {
            title: "Política",
            news: createDummyNews("Política", 3),
            link: "/noticias/politica",
            image: "https://images.unsplash.com/photo-1529107386315-e4214f52f7b0?w=400&h=250&fit=crop&q=80"
        },
        {
            title: "Cultura",
            news: createDummyNews("Cultura", 3),
            link: "/noticias/cultura",
            image: "https://images.unsplash.com/photo-1511735111817-57ebd0dce096?w=400&h=250&fit=crop&q=80"
        },
        {
            title: "Turismo",
            news: createDummyNews("Turismo", 3),
            link: "/noticias/turismo",
            image: "https://images.unsplash.com/photo-1502602898657-3e91760c0341?w=400&h=250&fit=crop&q=80"
        },
        {
            title: "Bem-Estar",
            news: createDummyNews("Bem-Estar", 3),
            link: "/noticias/bem-estar",
            image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop&q=80"
        },
    ];

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
                        >
                            <h3 className="text-xl font-bold text-blue-900 mb-4 border-b-2 border-blue-200 pb-2">
                                {category.title}
                            </h3>
                            <Link to={category.link} className="block mb-4 group">
                                <div className="overflow-hidden rounded-lg">
                                    <img src={category.image} alt={`Notícias sobre ${category.title}`} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"  src="https://images.unsplash.com/photo-1661546393560-d6e920741276" />
                                </div>
                            </Link>
                            <div className="space-y-3">
                                {category.news.map(item => (
                                    <Link key={item.id} to={`/noticia/${item.slug}`} className="block text-gray-700 hover:text-blue-700 font-medium transition-colors">
                                        {item.title}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewsGrid;