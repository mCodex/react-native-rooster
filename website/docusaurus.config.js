module.exports = {
  title: "react-native-rooster 🐔",
  tagline: "An elegant and flexible toast solution for your react-native apps",
  url: "https://mcodex.dev",
  baseUrl: "/react-native-rooster/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "mcodex",
  projectName: "react-native-rooster",
  themeConfig: {
    googleAnalytics: {
      trackingID: "UA-79205996-7",
    },
    navbar: {
      title: "react-native-rooster",
      logo: {
        alt: "react-native-rooster logo",
        src: "img/logo.svg",
      },
      items: [
        {
          to: "docs/",
          activeBasePath: "docs",
          label: "Docs",
          position: "right",
        },
        // { to: 'blog', label: 'Blog', position: 'left' },
        {
          href: "https://github.com/mcodex/react-native-rooster",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright: `Copyright © ${new Date().getFullYear()} Made with ❤️ by mCodex`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          homePageId: "overview",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/mcodex/react-native-rooster/edit/website/website/",
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
