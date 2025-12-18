import React from 'react';
    import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
    import { HelmetProvider } from 'react-helmet-async';
    import { Toaster } from '@/components/ui/toaster';
    import Header from '@/components/layout/Header';
    import Footer from '@/components/layout/Footer';
    import WhatsAppFloat from '@/components/common/WhatsAppFloat';
    import AiChatbot from '@/components/common/AiChatbot';
    import Home from '@/pages/Home';
    import Companies from '@/pages/Companies';
    import Professionals from '@/pages/Professionals';
    import ProfessionalProfilePage from '@/pages/ProfessionalProfilePage';
    import News from '@/pages/News';
    import NewsDetailsPage from '@/pages/NewsDetailsPage';
    import Events from '@/pages/Events';
    import EventDetailsPage from '@/pages/EventDetailsPage';
    import Jobs from '@/pages/Jobs';
    import JobDetails from '@/pages/JobDetails';
    import Resumes from '@/pages/Resumes';
    import Marketplace from '@/pages/Marketplace';
    import StorePage from '@/pages/StorePage';
    import Rankings from '@/pages/Rankings';
    import PublicUtilities from '@/pages/PublicUtilities';
    import TheCity from '@/pages/TheCity';
    import Advertise from '@/pages/Advertise';
    import About from '@/pages/About';
    import Contact from '@/pages/Contact';
    import Privacy from '@/pages/Privacy';
    import Terms from '@/pages/Terms';
    import Franchise from '@/pages/Franchise';
    import BestOfTheYear from '@/pages/BestOfTheYear';
    import PartnerPage from '@/pages/PartnerPage';
    import SubscriberPage from '@/pages/Subscriber';
    import SocialResponsibility from '@/pages/SocialResponsibility';
    import AiAdmin from '@/pages/admin/AiAdmin';
    import Blog from '@/pages/Blog';
    import Testimonials from '@/pages/Testimonials';
    import CategoryPage from '@/pages/CategoryPage';
    import AdminCommercialGuide from '@/pages/admin/AdminCommercialGuide';
    import AdminProfessionalGuide from '@/pages/admin/AdminProfessionalGuide';
    import AdminTraining from '@/pages/admin/AdminTraining';
    import FreeRegister from '@/pages/FreeRegister';
    import UpgradePlan from '@/pages/UpgradePlan';
    import LgpdBanner from '@/components/common/LgpdBanner';
    import Tutorial from '@/pages/Tutorial';
    import SubscriberContract from '@/pages/SubscriberContract';
    import FranchiseContract from '@/pages/FranchiseContract';
    import PortalTour from '@/pages/PortalTour';
    import Security from '@/pages/Security';
    import FranchiseeDashboard from '@/pages/FranchiseeDashboard';
    import FranchiseeCommercialGuide from '@/pages/franchisee/FranchiseeCommercialGuide';
    import FranchiseeProfessionalGuide from '@/pages/franchisee/FranchiseeProfessionalGuide';
    import FranchiseeManageBanners from '@/pages/franchisee/FranchiseeManageBanners';
    import Accessibility from '@/pages/Accessibility';
    import Forum from '@/pages/Forum';
    import EventCalendar from '@/pages/EventCalendar';
    import Checkout from '@/pages/Checkout';
    import PublicFigurePage from '@/pages/PublicFigurePage';
    import UserLogin from '@/pages/UserLogin';
    import ResetPassword from '@/pages/ResetPassword';
    import MaintenancePage from '@/pages/MaintenancePage';
    import PressRoom from '@/pages/PressRoom';
    import SubscribeNow from '@/pages/SubscribeNow';
    import RegisterCompany from '@/pages/RegisterCompany';
    import EditSubscriberProfile from '@/pages/EditSubscriberProfile';
    import SubscriberReports from '@/pages/SubscriberReports';
    import SubscriberPublicPage from '@/pages/SubscriberPublicPage';
    import AdminHeader from '@/components/admin/AdminHeader';

    import AdminLogin from '@/pages/admin/AdminLogin';
    import MasterLogin from '@/pages/admin/MasterLogin';
    import AdminDashboard from '@/pages/admin/AdminDashboard';
    import ContentAdminDashboard from '@/pages/admin/ContentAdminDashboard';
    import AdminManageSubscribers from '@/pages/admin/AdminManageSubscribers';
    import AdminManageFranchises from '@/pages/admin/AdminManageFranchises';
    import AdminPublishNews from '@/pages/admin/AdminPublishNews';
    import AdminBlog from '@/pages/admin/AdminBlog';
    import AdminManageEvents from '@/pages/admin/AdminManageEvents';
    import AdminModerateJobs from '@/pages/admin/AdminModerateJobs';
    import AdminManageStore from '@/pages/admin/AdminManageStore';
    import AdminViewReports from '@/pages/admin/AdminViewReports';
    import AdminTeamPermissions from '@/pages/admin/AdminTeamPermissions';
    import AdminGeneralSettings from '@/pages/admin/AdminGeneralSettings';
    import AdminMedia from '@/pages/admin/AdminMedia';
    import AdminManageBanners from '@/pages/admin/AdminManageBanners';
    import AdminMonetization from '@/pages/admin/AdminMonetization';
    import AdminGamification from '@/pages/admin/AdminGamification';
    import AdminForum from '@/pages/admin/AdminForum';
    import TestDriveStore from '@/pages/TestDriveStore';
    import StoreDashboard from '@/pages/StoreDashboard';
    import AdminManagePremiumPages from '@/pages/admin/AdminManagePremiumPages';

    import AiTrainingKnowledge from '@/pages/admin/ai/AiTrainingKnowledge';
    import AiPersonality from '@/pages/admin/ai/AiPersonality';
    import AiAutoResponses from '@/pages/admin/ai/AiAutoResponses';
    import AiChatHistory from '@/pages/admin/ai/AiChatHistory';
    import AiAnalytics from '@/pages/admin/ai/AiAnalytics';
    import AiManageReplicants from '@/pages/admin/ai/AiManageReplicants';
    import AiIntegrationSettings from '@/pages/admin/ai/AiIntegrationSettings';
    import AiSecurityFilters from '@/pages/admin/ai/AiSecurityFilters';
    import AiTeamManagement from '@/pages/admin/ai/AiTeamManagement';

    import { RoleGuard } from '@/components/auth/RoleGuard';
    import UnauthorizedPage from '@/pages/Unauthorized';
    import RealTimeInfo from '@/pages/RealTimeInfo';
    import Helpdesk from '@/pages/Helpdesk';
    import { useIdleTimeout } from '@/hooks/useIdleTimeout';
    import GoogleAnalytics from '@/components/seo/GoogleAnalytics';
    import { useAuth } from '@/contexts/AuthContext';
    import ScrollToTop from '@/components/common/ScrollToTop';

    const VotingPage = React.lazy(() => import('@/pages/VotingPage'));
    const EmpregaParaisoPage = React.lazy(() => import('@/pages/EmpregaParaisoPage'));


    const AdminLayout = () => (
      <div className="bg-gray-100 min-h-screen">
        <AdminHeader />
        <div className="p-4 md:p-8">
            <Outlet />
        </div>
      </div>
    );

    const AdminDashboardResolver = () => {
      const { user } = useAuth();
      if (user?.role === 'content_admin') {
        return <ContentAdminDashboard />;
      }
      return <AdminDashboard />;
    };

    const MaintenanceGuard = ({ children }) => {
        const { user: adminUser, loading: adminLoading, settings } = useAuth();
        
        if (adminLoading) {
            return <div className="flex justify-center items-center h-screen">Carregando...</div>;
        }

        const isMaintenanceMode = settings?.maintenanceMode;
        const adminRoles = ['master', 'general_admin', 'content_admin', 'franchisee'];

        if (isMaintenanceMode && (!adminUser || !adminRoles.includes(adminUser.role))) {
            return <Navigate to="/maintenance" replace />;
        }

        return children;
    };

    function App() {
      useIdleTimeout();

      return (
        <HelmetProvider>
          <Router>
            <ScrollToTop />
            <GoogleAnalytics />
            <React.Suspense fallback={<div className="flex justify-center items-center h-screen">Carregando módulo...</div>}>
            <Routes>
              <Route path="/login-admin" element={<AdminLogin />} />
              <Route path="/login-master" element={<MasterLogin />} />
              <Route path="/area-do-assinante" element={<UserLogin />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              <Route path="/admin" element={<RoleGuard requiredRoles={['master', 'general_admin', 'content_admin']}><AdminLayout /></RoleGuard>}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<RoleGuard requiredRoles={['master', 'general_admin', 'content_admin']}><AdminDashboardResolver /></RoleGuard>} />
                <Route path="guia-comercial" element={<RoleGuard requiredRoles={['master', 'general_admin']}><AdminCommercialGuide /></RoleGuard>} />
                <Route path="guia-profissional" element={<RoleGuard requiredRoles={['master', 'general_admin']}><AdminProfessionalGuide /></RoleGuard>} />
                <Route path="noticias" element={<RoleGuard requiredRoles={['master', 'general_admin', 'content_admin']}><AdminPublishNews /></RoleGuard>} />
                <Route path="publish-news" element={<Navigate to="/admin/noticias" replace />} />
                <Route path="blog" element={<RoleGuard requiredRoles={['master', 'general_admin', 'content_admin']}><AdminBlog /></RoleGuard>} />
                <Route path="eventos" element={<RoleGuard requiredRoles={['master', 'general_admin', 'content_admin']}><AdminManageEvents /></RoleGuard>} />
                <Route path="manage-events" element={<Navigate to="/admin/eventos" replace />} />
                <Route path="vagas" element={<RoleGuard requiredRoles={['master', 'general_admin']}><AdminModerateJobs /></RoleGuard>} />
                <Route path="relatorios" element={<RoleGuard requiredRoles={['master', 'general_admin']}><AdminViewReports /></RoleGuard>} />
                <Route path="treinamento" element={<RoleGuard requiredRoles={['master', 'general_admin']}><AdminTraining /></RoleGuard>} />
                <Route path="configuracoes" element={<RoleGuard requiredRoles={['master']}><AdminGeneralSettings /></RoleGuard>} />
                <Route path="media" element={<RoleGuard requiredRoles={['master', 'general_admin']}><AdminMedia /></RoleGuard>} />
                <Route path="banners" element={<RoleGuard requiredRoles={['master', 'general_admin']}><AdminManageBanners /></RoleGuard>} />
                <Route path="monetizacao" element={<RoleGuard requiredRoles={['master', 'general_admin']}><AdminMonetization /></RoleGuard>} />
                <Route path="gamificacao" element={<RoleGuard requiredRoles={['master', 'general_admin']}><AdminGamification /></RoleGuard>} />
                <Route path="forum" element={<RoleGuard requiredRoles={['master', 'general_admin']}><AdminForum /></RoleGuard>} />
                <Route path="loja" element={<RoleGuard requiredRoles={['master', 'general_admin']}><AdminManageStore /></RoleGuard>} />
                <Route path="assinantes" element={<RoleGuard requiredRoles={['master', 'general_admin']}><AdminManageSubscribers /></RoleGuard>} />
                <Route path="manage-subscribers" element={<Navigate to="/admin/assinantes" replace />} />
                <Route path="franquias" element={<RoleGuard requiredRoles={['master']}><AdminManageFranchises /></RoleGuard>} />
                <Route path="equipe" element={<RoleGuard requiredRoles={['master']}><AdminTeamPermissions /></RoleGuard>} />
                <Route path="paginas-premium" element={<RoleGuard requiredRoles={['master', 'general_admin']}><AdminManagePremiumPages /></RoleGuard>} />
                <Route path="ai" element={<RoleGuard requiredRoles={['master']}><Outlet/></RoleGuard>}>
                    <Route index element={<AiAdmin />} />
                    <Route path="treinamento" element={<AiTrainingKnowledge />} />
                    <Route path="personalidade" element={<AiPersonality />} />
                    <Route path="respostas" element={<AiAutoResponses />} />
                    <Route path="historico" element={<AiChatHistory />} />
                    <Route path="metricas" element={<AiAnalytics />} />
                    <Route path="replicas" element={<AiManageReplicants />} />
                    <Route path="integracoes" element={<AiIntegrationSettings />} />
                    <Route path="seguranca" element={<AiSecurityFilters />} />
                    <Route path="gestao-equipe" element={<AiTeamManagement />} />
                </Route>
              </Route>

              <Route path="/franquia" element={<RoleGuard requiredRoles={['franchisee']}><AdminLayout/></RoleGuard>}>
                  <Route path="dashboard" element={<FranchiseeDashboard />} />
                  <Route path="guia-comercial" element={<FranchiseeCommercialGuide />} />
                  <Route path="guia-profissional" element={<FranchiseeProfessionalGuide />} />
                  <Route path="banners" element={<FranchiseeManageBanners />} />
              </Route>

              <Route path="/" element={<MaintenanceGuard><AppLayout /></MaintenanceGuard>}>
                <Route index element={<Home />} />
                {/* URL principal do painel do assinante (em inglês) */}
                <Route path="/subscriber-area" element={<RoleGuard requiredRoles={['subscriber']}><SubscriberPage /></RoleGuard>} />
                {/* Alias em português - redireciona para /subscriber-area para garantir consistência */}
                <Route path="/painel-assinante" element={<Navigate to="/subscriber-area" replace />} />
                <Route path="/editar-perfil" element={<RoleGuard requiredRoles={['subscriber']}><EditSubscriberProfile /></RoleGuard>} />
                <Route path="/relatorios-desempenho" element={<RoleGuard requiredRoles={['subscriber']}><SubscriberReports /></RoleGuard>} />
                <Route path="/dashboard/loja" element={<RoleGuard requiredRoles={['master', 'general_admin', 'subscriber']}><StoreDashboard /></RoleGuard>} />
                <Route path="/guia-comercial" element={<Companies />} />
                <Route path="/guia-comercial/:slug" element={<PartnerPage />} />
                <Route path="/empresa/:slug" element={<SubscriberPublicPage />} />
                <Route path="/guia-profissional" element={<Professionals />} />
                <Route path="/guia-profissional/:slug" element={<ProfessionalProfilePage />} />
                <Route path="/personalidade/:slug" element={<PublicFigurePage />} />
                <Route path="/noticias" element={<News />} />
                <Route path="/noticia/:slug" element={<NewsDetailsPage />} />
                <Route path="/noticias/:category" element={<CategoryPage />} />
                <Route path="/eventos" element={<Events />} />
                <Route path="/evento/:slug" element={<EventDetailsPage />} />
                <Route path="/calendario" element={<EventCalendar />} />
                <Route path="/vagas" element={<Jobs />} />
                <Route path="/vaga/:jobId" element={<JobDetails />} />
                <Route path="/curriculos" element={<Resumes />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/marketplace/:storeSlug" element={<StorePage />} />
                <Route path="/loja/:slug" element={<StorePage />} />
                <Route path="/loja/test-drive" element={<TestDriveStore />} />
                <Route path="/rankings" element={<Rankings />} />
                <Route path="/utilidades" element={<PublicUtilities />} />
                <Route path="/cidade" element={<TheCity />} />
                <Route path="/anuncie-aqui" element={<Advertise />} />
                <Route path="/responsabilidade-social" element={<SocialResponsibility />} />
                <Route path="/cadastre-sua-empresa" element={<RegisterCompany />} />
                <Route path="/cadastrar-empresa" element={<RegisterCompany />} />
                <Route path="/register-company" element={<RegisterCompany />} />
                <Route path="/register-your-company" element={<RegisterCompany />} />
                <Route path="/assine-agora" element={<SubscribeNow />} />
                <Route path="/cadastro-gratis" element={<FreeRegister />} />
                <Route path="/cadastro-gratuito" element={<FreeRegister />} />
                <Route path="/acadastro-gratuito" element={<FreeRegister />} />
                <Route path="/upgrade" element={<RoleGuard requiredRoles={['subscriber']}><UpgradePlan /></RoleGuard>} />
                <Route path="/upgrade-plan" element={<Navigate to="/upgrade" replace />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/sobre" element={<About />} />
                <Route path="/contato" element={<Contact />} />
                <Route path="/privacidade" element={<Privacy />} />
                <Route path="/termos" element={<Terms />} />
                <Route path="/franquia-seja-um" element={<Franchise />} />
                <Route path="/melhores-do-ano" element={<BestOfTheYear />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/depoimentos" element={<Testimonials />} />
                <Route path="/tutorial" element={<Tutorial />} />
                <Route path="/contrato-assinante" element={<SubscriberContract />} />
                <Route path="/contrato-franquia" element={<FranchiseContract />} />
                <Route path="/tour" element={<PortalTour />} />
                <Route path="/seguranca" element={<Security />} />
                <Route path="/acessibilidade" element={<Accessibility />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/informacoes" element={<RealTimeInfo />} />
                <Route path="/suporte" element={<Helpdesk />} />
                <Route path="/sala-de-imprensa" element={<PressRoom />} />
                <Route path="/trabalhe-conosco" element={<Resumes />} />
                <Route path="/votacao" element={<VotingPage />} />
                <Route path="/empregos" element={<EmpregaParaisoPage />} />
              </Route>
            </Routes>
            </React.Suspense>
            <Toaster />
          </Router>
        </HelmetProvider>
      );
    }

    const AppLayout = () => {
        const { user: adminUser } = useAuth();
        const isAdmin = adminUser && ['master', 'general_admin', 'content_admin', 'franchisee'].includes(adminUser.role);

        return (
            <>
                {!isAdmin && <Header />}
                <main className="min-h-screen">
                    <Outlet />
                </main>
                {!isAdmin && <Footer />}
                <WhatsAppFloat />
                <AiChatbot />
                <LgpdBanner />
            </>
        );
    };

    export default App;