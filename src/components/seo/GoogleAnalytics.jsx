import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const GoogleAnalytics = () => {
  const location = useLocation();
  
  // ATENÇÃO: Substitua 'G-XXXXXXXXXX' pelo seu ID de acompanhamento do Google Analytics 4.
  const GA_TRACKING_ID = 'G-XXXXXXXXXX'; 
  // ATENÇÃO: Substitua 'XXXXXXXXXXXXXXXX' pelo seu código de verificação do Google Search Console.
  const GSC_VERIFICATION_CODE = 'XXXXXXXXXXXXXXXX';

  useEffect(() => {
    if (GA_TRACKING_ID === 'G-XXXXXXXXXX') {
      console.warn('Google Analytics: ID de acompanhamento não configurado.');
      return;
    }

    const scriptId = 'ga-gtag';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){
      // eslint-disable-next-line no-undef
      dataLayer.push(arguments);
    }
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', GA_TRACKING_ID);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  useEffect(() => {
    if (GA_TRACKING_ID === 'G-XXXXXXXXXX' || typeof window.gtag !== 'function') return;
    
    window.gtag('config', GA_TRACKING_ID, {
      page_path: location.pathname + location.search,
    });
  }, [location, GA_TRACKING_ID]);

  return (
    <Helmet>
        {GSC_VERIFICATION_CODE !== 'XXXXXXXXXXXXXXXX' && (
            <meta name="google-site-verification" content={GSC_VERIFICATION_CODE} />
        )}
    </Helmet>
  );
};

export default GoogleAnalytics;