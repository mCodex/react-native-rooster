/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      items: ["overview", "installation"],
    },
    {
      type: 'category',
      label: 'API',
      items: ["addToast", "removeToast", "setToastConfig"],
    },
    {
      type: 'category',
      label: 'Developing',
      items: ['contributing'],
    },
  ],
};

module.exports = sidebars;
