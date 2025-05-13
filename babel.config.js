/**
 * Babel configuration for Docusaurus
 * 
 * This configuration includes performance optimizations 
 * for faster builds and better runtime performance
 */
module.exports = {
  presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
  // For better performance
  assumptions: {
    constantReexports: true,
    constantSuper: true,
    noDocumentAll: true,
    noNewArrows: true,
    setPublicClassFields: true,
  },
};
