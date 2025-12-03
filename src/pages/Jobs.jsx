import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Star, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import JobHeader from '@/components/jobs/JobHeader.jsx';
import JobCard from '@/components/jobs/JobCard.jsx';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [jobs, setJobs] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem('ppo_jobs')) || [
       { id: 1, title: "Desenvolvedor Full Stack Sênior", company: "Tech Solutions Ltda", location: "Remoto", type: "CLT", salary: "R$ 12.000", category: "tecnologia", level: 'senior', description: "Buscamos desenvolvedor experiente em React, Node.js e bancos de dados para integrar nossa equipe de desenvolvimento de produtos inovadores.", requirements: ["React", "Node.js", "PostgreSQL", "AWS", "5+ anos de experiência"], benefits: ["Vale refeição", "Plano de saúde", "Home office", "Participação nos lucros"], postedDate: "2025-09-05", applications: 45, views: 320, featured: true, urgent: false, status: 'Aprovada' },
       { id: 2, title: "Analista de Marketing Digital Pleno", company: "Marketing Pro", location: "São João do Paraíso, MG", type: "CLT", salary: "R$ 6.500", category: "marketing", level: 'pleno', description: "Profissional para gerenciar campanhas digitais, análise de métricas e estratégias de crescimento em redes sociais.", requirements: ["Google Ads", "Facebook Ads", "Analytics", "2+ anos de experiência"], benefits: ["Vale refeição", "Plano de saúde", "Flexibilidade de horário"], postedDate: "2025-09-04", applications: 28, views: 180, featured: true, urgent: true, status: 'Aprovada' },
       { id: 3, title: "Vendedor Externo", company: "Vendas & Cia", location: "São João do Paraíso, MG", type: "PJ", salary: "R$ 2.500 + comissões", category: "vendas", level: 'junior', description: "Oportunidade para vendedor experiente com foco em B2B. Carteira de clientes estabelecida e território definido.", requirements: ["Experiência em vendas B2B", "CNH", "Disponibilidade para viagens"], benefits: ["Carro da empresa", "Combustível", "Comissões atrativas"], postedDate: "2025-09-03", applications: 67, views: 245, featured: false, urgent: false, status: 'Aprovada' },
    ];
    setJobs(storedJobs.filter(job => job.status === 'Aprovada'));
  }, []);

  const handleAction = (message) => {
    toast({
      title: "🚧 Funcionalidade em desenvolvimento",
      description: `${message} Você pode solicitá-la no seu próximo prompt! 🚀`,
    });
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || job.level === selectedLevel;
    const matchesType = selectedType === 'all' || job.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesLevel && matchesType;
  });

  const featuredJobs = filteredJobs.filter(job => job.featured);
  const regularJobs = filteredJobs.filter(job => !job.featured);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Vagas de Emprego - Portal Paraíso Online</title>
        <meta name="description" content="Encontre as melhores oportunidades de trabalho na região. Portal Paraíso Online conecta talentos e empresas." />
      </Helmet>

      <div className="container mx-auto px-4">
        <Breadcrumbs />
        <JobHeader onPostJob={() => handleAction("Publicação de vagas por empresas.")} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative col-span-1 md:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Buscar por cargo ou empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger><SelectValue placeholder="Filtrar por Categoria" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                <SelectItem value="tecnologia">Tecnologia</SelectItem>
                <SelectItem value="vendas">Vendas</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="administrativo">Administrativo</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger><SelectValue placeholder="Filtrar por Nível" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Níveis</SelectItem>
                <SelectItem value="junior">Júnior</SelectItem>
                <SelectItem value="pleno">Pleno</SelectItem>
                <SelectItem value="senior">Sênior</SelectItem>
              </SelectContent>
            </Select>

             <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger><SelectValue placeholder="Filtrar por Contrato" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Contratos</SelectItem>
                <SelectItem value="CLT">CLT</SelectItem>
                <SelectItem value="PJ">PJ</SelectItem>
                <SelectItem value="Estágio">Estágio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {featuredJobs.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mb-12">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
              <Star className="mr-2 text-yellow-500 fill-current" /> Vagas em Destaque
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredJobs.map((job) => (
                <Link to={`/vaga/${job.id}`} key={job.id} className="block">
                  <JobCard job={job} isFeatured={true} onApply={() => handleAction(`Candidatura para ${job.title}`)} onSchedule={() => handleAction(`Agendamento para ${job.title}`)} />
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            📋 Todas as Vagas ({regularJobs.length})
          </h2>
          <div className="space-y-4">
            {regularJobs.map((job) => (
               <Link to={`/vaga/${job.id}`} key={job.id} className="block">
                <JobCard job={job} isFeatured={false} onApply={() => handleAction(`Candidatura para ${job.title}`)} onSchedule={() => handleAction(`Agendamento para ${job.title}`)} />
              </Link>
            ))}
          </div>
        </motion.section>

        {filteredJobs.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma vaga encontrada</h3>
            <p className="text-gray-600 mb-6">Tente ajustar os filtros ou termos de busca</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Jobs;