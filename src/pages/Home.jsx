import React from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from '@/components/home/HeroSection';
import TopBanner from '@/components/home/TopBanner';
import Ticker from '@/components/home/Ticker';
import MainContent from '@/components/home/MainContent';
import NewsGrid from '@/components/home/NewsGrid';
import SocialBar from '@/components/home/SocialBar';
import PartnerLogos from '@/components/home/PartnerLogos';
import FeedbackSection from '@/components/home/FeedbackSection';
import CommunityForumCta from '@/components/home/CommunityForumCta';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Helmet>
        <title>Portal Paraíso Online - Conectando Negócios e Oportunidades</title>
        <meta name="description" content="O maior portal de empresas, notícias e serviços de São João do Paraíso. Descubra, conecte e cresça conosco." />
      </Helmet>

      <HeroSection />
      <TopBanner />
      <Ticker />
      <MainContent />
      <NewsGrid />
      <CommunityForumCta />
      <PartnerLogos />
      <FeedbackSection />
      <TopBanner isBottom={true} />
      <SocialBar />
    </div>
  );
};

export default Home;