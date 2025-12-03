import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const breadcrumbNameMap = {
  '/guia-comercial': 'Guia Comercial',
  '/guia-profissional': 'Guia Profissional',
  '/noticias': 'Notícias',
  '/eventos': 'Eventos',
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
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const name = breadcrumbNameMap[to] || value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');

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