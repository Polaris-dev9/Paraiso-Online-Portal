import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FileText, UserCheck, Shield, DollarSign, AlertTriangle, Mail } from 'lucide-react';

const Terms = () => {
  const sections = [
    {
      icon: UserCheck,
      title: "1. Aceitação dos Termos",
      content: [
        "Ao acessar e utilizar o Portal Paraíso Online ('PPO', 'nós', 'nosso'), você concorda em cumprir e estar sujeito a estes Termos de Uso. Se você não concordar com estes termos, não utilize nosso site ou serviços.",
        "Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação no site. O uso contínuo do site após as alterações constitui sua aceitação dos novos termos."
      ]
    },
    {
      icon: Shield,
      title: "2. Uso do Conteúdo",
      content: [
        "Todo o conteúdo publicado no PPO, incluindo textos, imagens, vídeos e logotipos, é de nossa propriedade ou licenciado para nós e protegido por leis de direitos autorais. Você não pode reproduzir, distribuir, modificar ou criar trabalhos derivados do nosso conteúdo sem nossa permissão expressa por escrito.",
        "Você pode compartilhar links para nosso conteúdo em redes sociais, desde que o crédito seja dado ao PPO."
      ]
    },
    {
      icon: UserCheck,
      title: "3. Conduta do Usuário",
      content: [
        "Ao utilizar nosso site, você concorda em não publicar ou transmitir qualquer material que seja ilegal, difamatório, obsceno, abusivo ou que infrinja os direitos de terceiros.",
        "Você é o único responsável por qualquer conteúdo que postar, incluindo comentários em notícias e eventos. Os comentários não refletem a opinião do PPO.",
        "Não é permitido o uso de nosso portal para fins comerciais não autorizados, spam ou qualquer forma de solicitação em massa."
      ]
    },
    {
      icon: DollarSign,
      title: "4. Assinaturas e Pagamentos",
      content: [
        "Oferecemos planos de assinatura (Básico, Premium, Destaque) com pagamentos recorrentes. Ao assinar, você concorda com os termos de pagamento e cobrança especificados.",
        "Os pagamentos podem ser feitos via cartão de crédito, PIX ou boleto. As assinaturas são renovadas automaticamente, a menos que sejam canceladas antes da data de renovação.",
        "Você pode cancelar sua assinatura a qualquer momento através do seu painel de assinante. Não haverá reembolso por períodos parciais de assinatura."
      ]
    },
    {
      icon: AlertTriangle,
      title: "5. Limitação de Responsabilidade",
      content: [
        "O PPO é fornecido 'como está'. Não garantimos que o site será livre de erros ou interrupções. Não nos responsabilizamos por quaisquer danos diretos, indiretos, incidentais ou consequentes resultantes do uso ou da incapacidade de usar nosso site.",
        "Não nos responsabilizamos pelo conteúdo de sites de terceiros vinculados a partir do nosso portal."
      ]
    },
    {
      icon: Mail,
      title: "6. Rescisão",
      content: [
        "Reservamo-nos o direito de suspender ou encerrar seu acesso ao nosso site a qualquer momento, sem aviso prévio, por qualquer violação destes Termos de Uso.",
        "Em caso de rescisão, as disposições relativas a direitos autorais, limitação de responsabilidade e outras seções relevantes permanecerão em vigor."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Termos de Uso - Portal Paraíso Online</title>
        <meta name="description" content="Leia os Termos de Uso do Portal Paraíso Online para entender as regras e diretrizes para utilização de nossos serviços." />
        <meta property="og:title" content="Termos de Uso - Portal Paraíso Online" />
        <meta property="og:description" content="Leia os Termos de Uso do Portal Paraíso Online para entender as regras e diretrizes para utilização de nossos serviços." />
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
            <FileText className="inline-block mr-3" />
            Termos de Uso
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ao utilizar o Portal Paraíso Online, você concorda com as seguintes condições.
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
          <h2 className="text-2xl font-bold text-blue-900 mb-4">📋 Bem-vindo ao Portal Paraíso Online!</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Estes Termos de Uso regem o seu acesso e uso do site e dos serviços oferecidos pelo Portal Paraíso Online (PPO). 
            Ao acessar nosso site, você reconhece que leu, entendeu e concorda em ficar vinculado a estes termos.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Se você não concordar com qualquer parte destes termos, por favor, não utilize nossos serviços.
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

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-8 mt-8"
        >
          <h2 className="text-2xl font-bold text-blue-900 mb-4">📧 Dúvidas sobre os Termos</h2>
          <p className="text-gray-700 mb-6">
            Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato conosco através do e-mail:
          </p>
          <p className="text-blue-600 font-semibold text-lg">
            juridico@portalparaisoonline.com.br
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;