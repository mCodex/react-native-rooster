module.exports = {
  title: 'react-native-rooster 🐔',
  tagline: 'An elegant and flexible toast solution for your react-native apps',
  url: 'https://mcodex.dev',
  baseUrl: '/react-native-rooster/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'mcodex',
  projectName: 'react-native-rooster',
  themeConfig: {
    prism: {
      theme: require('prism-react-renderer/themes/dracula'),
    },
    googleAnalytics: {
      trackingID: 'UA-79205996-7',
    },
    navbar: {
      title: 'react-native-rooster',
      logo: {
        alt: 'react-native-rooster logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'right',
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
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          homePageId: 'overview',
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
      },
    ],
  ],
};
