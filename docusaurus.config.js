// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'react-native-rooster 🐔',
  tagline: 'An elegant and flexible toast solution for your react-native apps',
  url: 'https://mcodex.dev',
  baseUrl: '/react-native-rooster/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'mcodex',
  projectName: 'react-native-rooster',
  
  // Performance and SEO optimization
  trailingSlash: true,
  noIndex: false, // Allow search engine indexing
  
  // Improved build settings
  staticDirectories: ['static'],
  
  // Webpack configuration for better performance
  webpack: {
    jsLoader: (isServer) => ({
      loader: require.resolve('swc-loader'),
      options: {
        jsc: {
          parser: {
            syntax: 'ecmascript',
            jsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    }),
  },
  
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
  themeConfig: {
    // Replace dark mode by default
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    prism: {
      theme: require('prism-react-renderer').themes.dracula,
    },
    // Google Analytics is now handled through gtag plugin
    // googleAnalytics has been removed in v3
    navbar: {
      title: 'react-native-rooster',
      logo: {
        alt: 'react-native-rooster logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'right',
          label: 'Docs',
        },
        {
          href: 'https://github.com/mcodex/react-native-rooster',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://github.com/mCodex/react-native-rooster/stargazers',
          label: 'Give a star ⭐️',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Made with ❤️ by mCodex`,
    },
    // Add image zoom
    zoom: {
      selector: '.markdown img',
      background: {
        light: 'rgb(255, 255, 255)',
        dark: 'rgb(50, 50, 50)'
      },
      config: {
        // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
      },
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/mcodex/react-native-rooster/edit/website/website/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          remarkPlugins: [require('./src/plugins/remark-npm2yarn')],
        },
        pages: {
          remarkPlugins: [require('./src/plugins/remark-npm2yarn')],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        googleAnalytics: {
          trackingID: 'UA-79205996-7',
          anonymizeIP: true,
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
        },
      }),
    ],
  ],
  
  // Add plugins for better performance and SEO
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        fromExtensions: ['html'],
        createRedirects: function (existingPath) {
          // Redirect old paths to new paths if any
          return undefined;
        },
      },
    ],
    () => ({
      name: 'docusaurus-optimizations',
      injectHtmlTags() {
        return {
          headTags: [
            {
              tagName: 'link',
              attributes: {
                rel: 'manifest',
                href: '/react-native-rooster/manifest.webmanifest',
              },
            },
            {
              tagName: 'meta',
              attributes: {
                name: 'theme-color',
                content: '#ff9100',
              },
            },
            {
              tagName: 'meta',
              attributes: {
                name: 'apple-mobile-web-app-capable',
                content: 'yes',
              },
            },
          ],
        };
      },
    }),
  ],
};

module.exports = config;
