import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Helmet>
        <title>Acesso Negado - Portal Paraíso Online</title>
      </Helmet>
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto bg-red-100 rounded-full p-4 w-fit">
            <ShieldOff className="h-12 w-12 text-red-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800 mt-4">Acesso Negado</CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Você não tem permissão para acessar esta página.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-gray-500">
            Se você acredita que isso é um erro, por favor, entre em contato com o suporte ou verifique se está logado na conta correta.
          </p>
          <Button asChild>
            <Link to="/">Voltar para a Página Inicial</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnauthorizedPage;