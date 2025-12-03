import React from 'react';
import { Youtube, Facebook, Instagram, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const SocialBar = () => {
  const socialLinks = [
    { name: 'YouTube', url: 'https://bit.ly/PortalGuiaparaisoonline', icon: Youtube, color: 'bg-red-600' },
    { name: 'Facebook', url: 'https://www.facebook.com/portalparaisoonline/', icon: Facebook, color: 'bg-blue-800' },
    { name: 'Instagram', url: 'https://www.instagram.com/portalparaisoonline/', icon: Instagram, color: 'bg-pink-600' },
  ];

  const columnists = [
    { name: "CDL e ACE", topic: "Associações Comerciais", image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=100&h=100&fit=crop&q=80", link: "/colunista/cdl-ace" },
    { name: "Saúde em Foco", topic: "Profissionais da Saúde", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=100&fit=crop&q=80", link: "/colunista/saude" },
    { name: "Direito e Deveres", topic: "Advogados e Juristas", image: "https://images.unsplash.com/photo-1589216532372-1c2a36790049?w=100&h=100&fit=crop&q=80", link: "/colunista/direito" },
    { name: "Paraíso Rural", topic: "Sindicato Rural", image: "https://images.unsplash.com/photo-1605000797433-2200f9a3c350?w=100&h=100&fit=crop&q=80", link: "/colunista/rural" },
  ];

  return (
    <section id="social-bar" className="py-12 bg-blue-900 text-white">
      <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div>
                  <h3 className="text-2xl font-bold mb-4">Siga Nossas Redes</h3>
                  <p className="text-blue-200 mb-4">Fique por dentro de tudo que acontece em tempo real.</p>
                  <div className="flex space-x-3">
                      {socialLinks.map(link => (
                          <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 ${link.color} rounded-full flex items-center justify-center hover:opacity-80 transition-opacity`}>
                              <link.icon size={20} />
                          </a>
                      ))}
                  </div>
              </div>
              <div className="md:col-span-2">
                  <h3 className="text-2xl font-bold mb-4 flex items-center"><Users className="mr-2"/> Nossos Colunistas e Parceiros</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {columnists.map(col => (
                          <Link to={col.link} key={col.name} className="text-center group">
                              <img alt={col.name} className="w-20 h-20 rounded-full mx-auto mb-2 border-2 border-blue-400 object-cover transition-transform duration-300 group-hover:scale-110" src={col.image}  src="https://images.unsplash.com/photo-1625581652944-2f297562baa5" />
                              <p className="font-semibold text-sm group-hover:text-yellow-300">{col.name}</p>
                              <p className="text-xs text-blue-300">{col.topic}</p>
                          </Link>
                      ))}
                  </div>
              </div>
          </div>
      </div>
    </section>
  );
};

export default SocialBar;