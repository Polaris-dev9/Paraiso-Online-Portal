import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, UserCheck, Briefcase, Newspaper, Lock, Info, Building, Award, Mic, Users, HelpCircle, FileText, Shield, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

const Footer = () => {
  const { user: adminUser } = useAuth();
  const { user: supabaseUser } = useSupabaseAuth();
  const user = adminUser || supabaseUser;

  const socialLinks = [
    { name: 'YouTube', url: 'https://bit.ly/PortalGuiaparaisoonline', icon: Youtube, color: 'hover:text-red-500' },
    { name: 'Facebook', url: 'https://www.facebook.com/portalparaisoonline/', icon: Facebook, color: 'hover:text-blue-500' },
    { name: 'Instagram', url: 'https://www.instagram.com/portalparaisoonline/', icon: Instagram, color: 'hover:text-pink-500' },
  ];

  const sitemap = [
    {
      title: 'O Portal',
      icon: Info,
      links: [
        { label: 'Sobre Nós', path: '/sobre' },
        { label: 'Anuncie Aqui', path: '/anuncie-aqui' },
        { label: 'Seja um Franqueado', path: '/franquia' },
        { label: 'Depoimentos', path: '/depoimentos' },
        { label: 'Responsabilidade Social', path: '/responsabilidade-social' },
        { label: 'Sala de Imprensa', path: '/sala-de-imprensa' },
        { label: 'Nossa Equipe', path: '/sobre#equipe' },
      ],
    },
    {
      title: 'Guias',
      icon: Building,
      links: [
        { label: 'Guia Comercial', path: '/guia-comercial' },
        { label: 'Guia Profissional', path: '/guia-profissional' },
        { label: 'Marketplace', path: '/marketplace' },
        { label: 'Rankings', path: '/rankings' },
        { label: 'Melhores do Ano', path: '/melhores-do-ano' },
        { label: 'Personalidades Públicas', path: '/personalidades' },
        { label: 'Utilidades Públicas', path: '/utilidades' },
      ],
    },
    {
      title: 'Conteúdo',
      icon: Newspaper,
      links: [
        { label: 'Notícias', path: '/noticias' },
        { label: 'Eventos', path: '/eventos' },
        { label: 'Blog', path: '/blog' },
        { label: 'Emprega Paraíso', path: '/empregos' },
        { label: 'A Cidade', path: '/cidade' },
        { label: 'Colunistas', path: '#social-bar' },
        { label: 'Fórum', path: '/forum' },
      ],
    },
    {
      title: 'Ajuda',
      icon: HelpCircle,
      links: [
        { label: 'Contato', path: '/contato' },
        { label: 'Central de Suporte', path: '/suporte' },
        { label: 'Tutorial do Portal', path: '/tutorial' },
        { label: 'Tour pelo Portal', path: '/tour' },
        { label: 'Termos de Serviço', path: '/termos' },
        { label: 'Política de Privacidade', path: '/privacidade' },
        { label: 'Acessibilidade', path: '/acessibilidade' },
      ],
    },
    {
      title: 'Para Você',
      icon: UserCheck,
      links: [
        { label: 'Área do Assinante', path: '/area-do-assinante' },
        { label: 'Assine Agora', path: '/assine-agora' },
        { label: 'Cadastre seu Currículo', path: '/empregos' },
        { label: 'Cadastre sua Empresa', path: '/anuncie-aqui' },
        { label: 'Certificado Premium', path: 'https://www.certificadopremium.com.br/', external: true },
        { label: 'Acesso Administrativo', path: '/login-admin' },
        { label: 'Sistema de Votação', path: '/votacao' },
      ],
    },
  ];

  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <p className="text-2xl font-bold">Portal Paraíso Online</p>
            <p className="mt-2 text-blue-200">Conectando pessoas, marcas e oportunidades.</p>
            <div className="flex space-x-4 mt-6">
              {socialLinks.map(link => (
                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className={`transition-colors ${link.color}`}>
                  <link.icon size={24} />
                </a>
              ))}
            </div>
          </div>
          {sitemap.map(section => {
            const Icon = section.icon;
            return (
              <div key={section.title}>
                <p className="font-semibold text-lg mb-4 flex items-center"><Icon size={20} className="mr-2 opacity-70"/>{section.title}</p>
                <ul className="space-y-2">
                  {section.links.map(link => (
                    <li key={link.label}>
                      {link.external ? (
                        <a href={link.path} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white hover:underline transition-colors text-sm">{link.label}</a>
                      ) : (
                        <Link to={link.path} className="text-blue-200 hover:text-white hover:underline transition-colors text-sm">{link.label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-blue-800 py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-blue-200">
          <p>&copy; {new Date().getFullYear()} Paraíso Online Digital LTDA. CNPJ: 21.130.723/0001-85</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <p>Rua Vicente Gomes, 231 - Sala 4 - Centro, SJP - MG</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;