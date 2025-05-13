import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import Preloader from '../components/Preloader';

const features = [
  {
    title: <>Multiplatform Support</>,
    imageUrl: 'img/undraw_mobile.svg',
    description: (
      <>
        Works on iOS, Android, Expo, MacOS and Windows
      </>
    ),
  },
  // {
  //   title: <>Small</>,
  //   imageUrl: "img/undraw_docusaurus_tree.svg",
  //   description: (
  //     <>
  //       RNRooster is tiny
  //     </>
  //   ),
  // },
  {
    title: <>Community Driven</>,
    imageUrl: 'img/undraw_community.svg',
    description: <>Developed and maintained by community</>,
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img
            className={styles.featureImage}
            src={imgUrl}
            alt={title}
            loading="lazy"
            width={200}
            height={200}
          />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

// The Preloader component is imported at the top of the file

function Home() {
  const { siteConfig } = useDocusaurusContext();
  
  React.useEffect(() => {
    // Add lazy loading to images for better performance
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.hasAttribute('loading')) {
        img.loading = 'lazy';
      }
    });
    
    // Add intersection observer for better performance
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target;
          image.src = image.dataset.src;
          observer.unobserve(image);
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      observer.observe(img);
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Layout title="Home" description={siteConfig.tagline}>
      <Preloader />
      <header className={clsx('hero', 'hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/overview')}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
