import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Building, HeartPulse, Bus, GraduationCap, Shield, Gavel, Mail, Banknote, Scale, School, Church, Leaf, Users, Phone, FileText, Landmark, HeartHandshake as Handshake, Globe, ExternalLink, Library, Vote } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PublicUtilities = () => {
  const { toast } = useToast();

  const handleLinkClick = (name, url) => {
    if(url) {
        window.open(url, '_blank');
    } else {
        toast({
          title: `🔗 Acessando ${name}`,
          description: "Link para este serviço não disponível no momento. 🚀",
        });
    }
  };

  const localServices = [
    { name: "Prefeitura Municipal", icon: Building }, { name: "Câmara Municipal", icon: Landmark },
    { name: "Polícia Militar", icon: Shield }, { name: "Corpo de Bombeiros", icon: Shield },
    { name: "SAMU", icon: HeartPulse }, { name: "Hospital Municipal", icon: HeartPulse },
    { name: "Postos de Saúde (UBS)", icon: HeartPulse }, { name: "Rodoviária", icon: Bus },
    { name: "Correios", icon: Mail }, { name: "CEMIG", icon: Banknote }, { name: "COPASA", icon: Banknote },
    { name: "Fórum", icon: Gavel }, { name: "INSS", icon: Scale }, { name: "Escolas Municipais", icon: School },
    { name: "Escolas Estaduais", icon: GraduationCap }, { name: "Igrejas", icon: Church },
    { name: "EMATER", icon: Leaf }, { name: "Associação Comercial", icon: Handshake },
    { name: "Guarda Mirim", icon: Users }, { name: "Lei Orgânica Municipal", icon: Library },
  ];

  const stateServices = [
      { name: "Governo de Minas Gerais", icon: Globe, url: "https://www.mg.gov.br/" },
      { name: "Polícia Civil MG", icon: Shield, url: "https://www.policiacivil.mg.gov.br/" },
      { name: "TRE-MG", icon: Vote, url: "https://www.tre-mg.jus.br/" },
  ];

  const federalServices = [
      { name: "Governo Federal", icon: Globe, url: "https://www.gov.br/" },
      { name: "Constituição Federal", icon: Library, url: "http://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm" },
      { name: "Câmara dos Deputados", icon: Landmark, url: "https://www.camara.leg.br/" },
      { name: "Senado Federal", icon: Landmark, url: "https://www.senado.leg.br/" },
      { name: "Supremo Tribunal Federal (STF)", icon: Gavel, url: "https://portal.stf.jus.br/" },
      { name: "Polícia Federal", icon: Shield, url: "https://www.gov.br/pf/pt-br" },
      { name: "OAB Nacional", icon: Gavel, url: "https://www.oab.org.br/" },
      { name: "Sistema Único de Saúde (SUS)", icon: HeartPulse, url: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/sus" },
  ];
  
  const citizenDocs = [
      { name: "Direitos do Cidadão", icon: FileText, url: "https://www.gov.br/mdh/pt-br/navegue-por-temas/direitos-humanos" },
      { name: "Direito Empresarial", icon: FileText, url: "https://www.gov.br/empresas-e-negocios/pt-br" },
      { name: "2ª Via de Documentos", icon: FileText, url: "https://www.gov.br/pt-br/servicos/obter-segunda-via-de-documentos" },
  ];

  const renderSection = (title, items) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }} 
      className="mb-12"
    >
      <h2 className="text-3xl font-bold text-blue-900 mb-6 border-b-4 border-blue-200 pb-3">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((util) => {
          const Icon = util.icon;
          return (
            <motion.button
              key={util.name}
              onClick={() => handleLinkClick(util.name, util.url)}
              whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(30, 58, 138, 0.1)' }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-xl shadow-lg p-6 text-left transition-all flex items-center space-x-4 border-l-4 border-blue-500"
            >
              <Icon className="text-blue-600" size={32} />
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{util.name}</h3>
                {util.url && <p className="text-sm text-green-600 flex items-center">Acessar link <ExternalLink size={12} className="ml-1" /></p>}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>Utilidades Públicas - Portal Paraíso Online</title>
        <meta name="description" content="Acesse rapidamente os principais serviços e contatos de utilidade pública da nossa cidade. Tudo o que você precisa em um só lugar." />
      </Helmet>

      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">ℹ️ Utilidades Públicas</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tudo o que o cidadão precisa no dia a dia, com acesso fácil e rápido.
          </p>
        </motion.div>

        {renderSection("Serviços Municipais", localServices)}
        {renderSection("Governo Estadual", stateServices)}
        {renderSection("Governo Federal", federalServices)}
        {renderSection("Documentos e Direitos", citizenDocs)}
      </div>
    </div>
  );
};

export default PublicUtilities;