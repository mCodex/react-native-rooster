import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { PageMetadata } from '@docusaurus/theme-common';
import { translate } from '@docusaurus/Translate';
import styles from './styles.module.css';

export default function NotFound() {
  return (
    <>
      <PageMetadata
        title={translate({
          id: 'theme.NotFound.title',
          message: 'Page Not Found',
        })}
      />
      <Layout>
        <div className={clsx('container', styles.notFoundContainer)}>
          <div className={styles.notFoundContent}>
            <h1 className={styles.notFoundTitle}>Page Not Found</h1>
            <p className={styles.notFoundText}>
              We couldn't find what you were looking for. The page might have been moved or renamed.
            </p>
            <div className={styles.buttons}>
              <Link
                className={clsx(
                  'button button--primary button--lg',
                  styles.getStarted,
                )}
                to={useBaseUrl('/')}
              >
                Go to Homepage
              </Link>
              <Link
                className={clsx(
                  'button button--outline button--secondary button--lg',
                  styles.getStarted,
                )}
                to={useBaseUrl('/docs/overview')}
              >
                Check Documentation
              </Link>
            </div>
          </div>
          <div className={styles.notFoundImage}>
            <img
              src={useBaseUrl('img/undraw_mobile.svg')}
              alt="Page not found"
              loading="lazy"
              width="400"
              height="300"
            />
          </div>
        </div>
      </Layout>
    </>
  );
}
