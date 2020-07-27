module.exports = {
  title: 'react-native-rooster',
  tagline: 'An elegant toast solution for your react-native apps',
  url: 'https://mcodex.dev/react-native-rooster',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'mcodex',
  projectName: 'react-native-rooster',
  themeConfig: {
    navbar: {
      title: 'react-native-rooster',
      // logo: {
      //   alt: 'My Site Logo',
      //   src: 'img/logo.svg',
      // },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'right',
        },
        // { to: 'blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/mcodex/react-native-rooster',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} mCodex`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          homePageId: 'addToast',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/mcodex/react-native-rooster/edit/website/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
