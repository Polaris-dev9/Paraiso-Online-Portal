import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Shield, Eye, Lock, Users, Database, Mail } from 'lucide-react';

const Privacy = () => {
  const sections = [
    {
      icon: Database,
      title: "Coleta de Informações",
      content: [
        "Coletamos informações que você nos fornece diretamente, como nome, e-mail, telefone e outras informações de contato quando você se cadastra, assina nossos serviços ou entra em contato conosco.",
        "Informações de navegação, incluindo endereço IP, tipo de navegador, páginas visitadas e tempo de permanência no site.",
        "Cookies e tecnologias similares para melhorar sua experiência de navegação e personalizar conteúdo."
      ]
    },
    {
      icon: Eye,
      title: "Uso das Informações",
      content: [
        "Fornecimento e melhoria dos nossos serviços de portal de notícias, eventos e vagas de emprego.",
        "Comunicação sobre atualizações, novos conteúdos e ofertas relevantes.",
        "Personalização da experiência do usuário e recomendações de conteúdo.",
        "Análise de uso do site para melhorias contínuas.",
        "Cumprimento de obrigações legais e regulamentares."
      ]
    },
    {
      icon: Users,
      title: "Compartilhamento de Dados",
      content: [
        "Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins comerciais.",
        "Podemos compartilhar informações com prestadores de serviços que nos auxiliam na operação do portal.",
        "Informações podem ser divulgadas quando exigido por lei ou para proteger nossos direitos legais.",
        "Dados agregados e anonimizados podem ser compartilhados para fins estatísticos."
      ]
    },
    {
      icon: Lock,
      title: "Segurança dos Dados",
      content: [
        "Implementamos medidas técnicas e organizacionais adequadas para proteger suas informações.",
        "Uso de criptografia SSL para transmissão segura de dados.",
        "Acesso restrito às informações pessoais apenas para funcionários autorizados.",
        "Monitoramento contínuo de segurança e atualizações regulares dos sistemas.",
        "Backup seguro e recuperação de dados em caso de incidentes."
      ]
    },
    {
      icon: Shield,
      title: "Seus Direitos",
      content: [
        "Direito de acesso: você pode solicitar informações sobre os dados que mantemos sobre você.",
        "Direito de retificação: você pode solicitar a correção de informações incorretas ou incompletas.",
        "Direito de exclusão: você pode solicitar a exclusão de seus dados pessoais.",
        "Direito de portabilidade: você pode solicitar a transferência de seus dados.",
        "Direito de oposição: você pode se opor ao processamento de seus dados para determinadas finalidades."
      ]
    },
    {
      icon: Mail,
      title: "Cookies e Tecnologias",
      content: [
        "Utilizamos cookies essenciais para o funcionamento básico do site.",
        "Cookies de análise para entender como os usuários interagem com nosso conteúdo.",
        "Cookies de personalização para melhorar sua experiência de navegação.",
        "Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.",
        "Alguns recursos do site podem não funcionar adequadamente se os cookies forem desabilitados."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Política de Privacidade - Portal Paraíso Online</title>
        <meta name="description" content="Política de Privacidade do Portal Paraíso Online. Saiba como protegemos e utilizamos suas informações pessoais." />
        <meta property="og:title" content="Política de Privacidade - Portal Paraíso Online" />
        <meta property="og:description" content="Política de Privacidade do Portal Paraíso Online. Saiba como protegemos e utilizamos suas informações pessoais." />
      </Helmet>

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">
            🔒 Política de Privacidade
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sua privacidade é fundamental para nós. Esta política explica como coletamos, usamos e protegemos suas informações pessoais.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            <p>Última atualização: Janeiro de 2024</p>
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-blue-900 mb-4">📋 Introdução</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            O Portal Paraíso Online ("PPO", "nós", "nosso" ou "nossa") está comprometido em proteger e respeitar sua privacidade. 
            Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você 
            visita nosso website, utiliza nossos serviços ou interage conosco.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Ao utilizar nossos serviços, você concorda com a coleta e uso de informações de acordo com esta política. 
            Recomendamos que você leia esta política cuidadosamente e entre em contato conosco se tiver dúvidas.
          </p>
        </motion.div>

        {/* Main Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-lg shadow-lg p-8"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 gradient-royal rounded-full flex items-center justify-center mr-4">
                    <Icon className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-900">{section.title}</h2>
                </div>
                <div className="space-y-4">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-600 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* LGPD Compliance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-white mt-8"
        >
          <h2 className="text-2xl font-bold mb-4">🇧🇷 Conformidade com a LGPD</h2>
          <p className="text-lg mb-4 opacity-90">
            Estamos em total conformidade com a Lei Geral de Proteção de Dados (LGPD) - Lei nº 13.709/2018.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">✅ Nossos Compromissos:</h3>
              <ul className="space-y-1 text-sm opacity-90">
                <li>• Transparência no tratamento de dados</li>
                <li>• Finalidade específica para coleta</li>
                <li>• Minimização de dados coletados</li>
                <li>• Segurança e confidencialidade</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">📞 Contato do Encarregado:</h3>
              <p className="text-sm opacity-90">
                Para exercer seus direitos ou esclarecer dúvidas sobre proteção de dados:
              </p>
              <p className="text-sm font-semibold">lgpd@portalparaisoonline.com.br</p>
            </div>
          </div>
        </motion.div>

        {/* Data Retention */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="bg-white rounded-lg shadow-lg p-8 mt-8"
        >
          <h2 className="text-2xl font-bold text-blue-900 mb-6">⏰ Retenção de Dados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Dados de Cadastro:</h3>
              <p className="text-gray-600 text-sm mb-4">
                Mantemos seus dados de cadastro enquanto sua conta estiver ativa ou conforme necessário 
                para fornecer nossos serviços.
              </p>
              
              <h3 className="font-semibold text-gray-900 mb-3">Dados de Navegação:</h3>
              <p className="text-gray-600 text-sm">
                Logs de acesso e dados de navegação são mantidos por até 12 meses para fins de 
                segurança e melhoria dos serviços.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Dados de Comunicação:</h3>
              <p className="text-gray-600 text-sm mb-4">
                E-mails e mensagens de contato são mantidos por até 5 anos para fins de 
                atendimento e histórico de relacionamento.
              </p>
              
              <h3 className="font-semibold text-gray-900 mb-3">Exclusão de Dados:</h3>
              <p className="text-gray-600 text-sm">
                Você pode solicitar a exclusão de seus dados a qualquer momento, exceto quando 
                a retenção for exigida por lei.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-8 mt-8"
        >
          <h2 className="text-2xl font-bold text-blue-900 mb-4">📧 Contato sobre Privacidade</h2>
          <p className="text-gray-700 mb-6">
            Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer seus direitos 
            relacionados aos dados pessoais, entre em contato conosco:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Dados de Contato:</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>E-mail:</strong> privacidade@portalparaisoonline.com.br</p>
                <p><strong>Telefone:</strong> (11) 9999-9999</p>
                <p><strong>Endereço:</strong> São Paulo, SP - Brasil</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Tempo de Resposta:</h3>
              <p className="text-sm text-gray-700 mb-2">
                Respondemos às solicitações relacionadas à privacidade em até 15 dias úteis, 
                conforme estabelecido pela LGPD.
              </p>
              <p className="text-sm text-gray-700">
                Para solicitações urgentes, utilize nosso canal de atendimento prioritário.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Updates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8 text-center"
        >
          <h3 className="text-lg font-bold text-yellow-900 mb-2">🔄 Atualizações desta Política</h3>
          <p className="text-yellow-800 text-sm">
            Esta Política de Privacidade pode ser atualizada periodicamente. Notificaremos sobre 
            mudanças significativas através do nosso site e por e-mail quando apropriado. 
            A data da última atualização está sempre indicada no topo desta página.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;