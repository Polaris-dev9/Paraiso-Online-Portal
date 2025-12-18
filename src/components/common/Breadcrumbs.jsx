import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const breadcrumbNameMap = {
  '/guia-comercial': 'Guia Comercial',
  '/guia-profissional': 'Guia Profissional',
  '/noticias': 'Notícias',
  '/noticia': 'Notícias', // Mapeamento para singular também
  '/eventos': 'Eventos',
  '/evento': 'Eventos', // Mapeamento para singular também
  '/vagas': 'Empregos',
  '/curriculos': 'Currículos',
  '/loja': 'Loja Virtual',
  '/rankings': 'Rankings',
  '/utilidades': 'Utilidades Públicas',
  '/cidade': 'A Cidade',
  '/anuncie': 'Anuncie Aqui',
  '/contato': 'Contato',
  '/sobre': 'Sobre Nós',
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Mapeamento especial para rotas que precisam de correção
  const routeCorrections = {
    '/noticia': '/noticias', // Corrige /noticia para /noticias
    '/evento': '/eventos',   // Corrige /evento para /eventos (caso necessário)
  };

  return (
    <nav aria-label="Breadcrumb" className="bg-gray-100 p-3 rounded-lg mb-8">
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        <li>
          <Link to="/" className="flex items-center hover:text-blue-600 transition-colors">
            <Home size={16} className="mr-2" />
            Início
          </Link>
        </li>
        {pathnames.map((value, index) => {
          let to = `/${pathnames.slice(0, index + 1).join('/')}`;
          // Aplica correção de rota se necessário
          if (routeCorrections[to]) {
            to = routeCorrections[to];
          }
          const isLast = index === pathnames.length - 1;
          // Usa o nome mapeado ou gera um nome amigável
          let name = breadcrumbNameMap[to] || value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');
          // Se for o último item e não tiver mapeamento, usa o nome original
          if (isLast && !breadcrumbNameMap[to]) {
            name = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');
          }

          return (
            <li key={to} className="flex items-center">
              <ChevronRight size={16} className="text-gray-400" />
              {isLast ? (
                <span className="ml-2 font-semibold text-gray-700" aria-current="page">
                  {name}
                </span>
              ) : (
                <Link to={to} className="ml-2 hover:text-blue-600 transition-colors">
                  {name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;