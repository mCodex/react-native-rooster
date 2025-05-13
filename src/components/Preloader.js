import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function Preloader() {
  const { siteConfig } = useDocusaurusContext();
  const logoUrl = useBaseUrl('img/logo.svg');
  const faviconUrl = useBaseUrl('img/favicon.ico');

  // Key images that should be preloaded
  const preloadImages = [
    logoUrl,
    useBaseUrl('img/undraw_mobile.svg'),
    useBaseUrl('img/undraw_community.svg'),
  ];

  return (
    <Head>
      {/* Preload critical assets */}
      <link rel="preload" href={logoUrl} as="image" />
      <link rel="preload" href={faviconUrl} as="image" />

      {/* Preconnect to origins */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* DNS prefetch */}
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />

      {/* Meta tags for better SEO */}
      <meta name="description" content={siteConfig.tagline} />
      <meta name="keywords" content="react-native, toast, notification, mobile, android, ios" />
      <meta name="author" content="mCodex" />
      <meta property="og:title" content={siteConfig.title} />
      <meta property="og:description" content={siteConfig.tagline} />
      <meta property="og:url" content={siteConfig.url} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={logoUrl} />
      <meta name="twitter:card" content="summary" />
    </Head>
  );
}
