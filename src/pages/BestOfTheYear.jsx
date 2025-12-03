import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Award, Vote, Users, Printer, Lock, CheckCircle, Instagram, Facebook, Youtube, User2 as UserTie, Building2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BestOfTheYear = () => {
  const { toast } = useToast();

  const handleVote = (category) => {
    toast({
      title: "Votação Encerrada",
      description: `A votação para ${category} está bloqueada no momento. Fique atento para a liberação!`,
      variant: "destructive"
    });
  };

  const handleSocialVote = (socialNetwork) => {
    let url = '';
    switch(socialNetwork) {
        case 'instagram': url = 'https://www.instagram.com/portalparaisoonline/'; break;
        case 'facebook': url = 'https://www.facebook.com/portalparaisoonline/'; break;
        case 'youtube': url = 'https://bit.ly/PortalGuiaparaisoonline'; break;
        default: return;
    }
    window.open(url, '_blank');
  }

  const commercialCategories = [
    "Restaurante", "Loja de Roupas", "Supermercado", "Farmácia", "Padaria", "Salão de Beleza"
  ];
  const professionalCategories = [
    "Advogado(a)", "Médico(a)", "Engenheiro(a)", "Contador(a)", "Professor(a)", "Arquiteto(a)"
  ];
  const publicPersonalitiesCategories = [
    "Influenciador(a) Digital", "Político(a)", "Artista Local", "Atleta", "Empresário(a) de Destaque", "Líder Comunitário"
  ];

  const winners = [
    { rank: 1, name: 'Empresa Vencedora A', votes: '15.432', icon: '🏆' },
    { rank: 2, name: 'Empresa Vencedora B', votes: '12.102', icon: '🥈' },
    { rank: 3, name: 'Empresa Vencedora C', votes: '9.876', icon: '🥉' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <Helmet>
        <title>Melhores do Ano - Portal Paraíso Online</title>
        <meta name="description" content="Participe da votação 'Melhores do Ano' e ajude a eleger as empresas e profissionais que se destacaram na região." />
      </Helmet>

      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full mb-4">
            <Award className="text-white" size={60} />
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-purple-800 mb-4">
            Melhores do Ano
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Sua voz decide! Ajude-nos a reconhecer e premiar quem fez a diferença em nossa comunidade!
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg mb-12 text-center">
            <div className="flex justify-center items-center">
                <Lock className="mr-3" />
                <p className="font-bold">A votação online está bloqueada no momento. Aguarde a liberação por um administrador para participar.</p>
            </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12 mb-16">
          <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">Participe da Votação</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Comerciais */}
            <div>
              <h3 className="font-semibold text-lg text-center mb-4 flex items-center justify-center gap-2"><Building2 /> Categorias Comerciais</h3>
              <Select onValueChange={handleVote}>
                <SelectTrigger><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger>
                <SelectContent>{commercialCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {/* Profissionais */}
            <div>
              <h3 className="font-semibold text-lg text-center mb-4 flex items-center justify-center gap-2"><UserTie /> Categorias Profissionais</h3>
              <Select onValueChange={handleVote}>
                <SelectTrigger><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger>
                <SelectContent>{professionalCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {/* Personalidades Públicas */}
            <div>
              <h3 className="font-semibold text-lg text-center mb-4 flex items-center justify-center gap-2"><Star /> Personalidades Públicas</h3>
              <Select onValueChange={handleVote}>
                <SelectTrigger><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger>
                <SelectContent>{publicPersonalitiesCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Button onClick={() => handleVote("geral")} disabled className="w-full md:w-auto px-10 py-6 text-lg">Votar Agora</Button>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-16">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">Como Participar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 gradient-royal rounded-full flex items-center justify-center mx-auto mb-4"><Users className="text-white" size={32} /></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Redes Sociais</h3>
              <p className="text-gray-600 mb-4">Participe também através de nossas enquetes e formulários nas redes sociais.</p>
              <div className="flex justify-center gap-2">
                <Button size="icon" onClick={() => handleSocialVote('instagram')} className="bg-pink-500 hover:bg-pink-600 text-white"><Instagram /></Button>
                <Button size="icon" onClick={() => handleSocialVote('facebook')} className="bg-blue-700 hover:bg-blue-800 text-white"><Facebook /></Button>
                <Button size="icon" onClick={() => handleSocialVote('youtube')} className="bg-red-600 hover:bg-red-700 text-white"><Youtube /></Button>
              </div>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 gradient-royal rounded-full flex items-center justify-center mx-auto mb-4"><Printer className="text-white" size={32} /></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Votação Presencial</h3>
              <p className="text-gray-600">Nossos agentes de pesquisa visitarão o comércio para coletar os votos pessoalmente.</p>
            </div>
             <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 gradient-royal rounded-full flex items-center justify-center mx-auto mb-4"><Vote className="text-white" size={32} /></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Votação Online</h3>
              <p className="text-gray-600">Vote diretamente pelo site quando a votação for liberada.</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div className="bg-gradient-to-r from-blue-800 to-purple-800 rounded-lg p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Gala de Premiação</h2>
              <p className="text-xl mb-6 opacity-90">
                Os vencedores serão anunciados em uma grande noite de gala! Veja os top 3 de uma categoria exemplo:
              </p>
               <div className="space-y-4">
                   {winners.map(winner => (
                       <div key={winner.rank} className="bg-white/20 p-4 rounded-lg flex items-center justify-between">
                           <div className="flex items-center">
                            <span className="text-3xl mr-4">{winner.icon}</span>
                            <span className="font-bold text-lg">{winner.name}</span>
                           </div>
                           <span className="font-semibold">{winner.votes} votos</span>
                       </div>
                   ))}
               </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-8 text-white text-center">
                <h2 className="text-3xl font-bold mb-4">Prêmio de Reconhecimento</h2>
                <p className="text-xl mb-6 opacity-90">
                    Neste ano, todos os nossos assinantes pagantes receberão um prêmio especial por valorizarem a publicidade e o comércio local.
                </p>
                <div className="flex items-center justify-center space-x-2 bg-white/20 p-4 rounded-lg">
                    <CheckCircle size={32}/>
                    <span className="font-bold text-lg">Um reconhecimento à sua parceria!</span>
                </div>
            </div>
        </motion.div>

      </div>
    </div>
  );
};

export default BestOfTheYear;