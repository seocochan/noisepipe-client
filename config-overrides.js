// const tsImportPluginFactory = require('ts-import-plugin');
// const { getLoader } = require('react-app-rewired');
// const rewireLessWithModule = require('react-app-rewire-less-with-modules');
const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modules: true,
    modifyVars: {
      '@layout-body-background': '#ffffff',
      '@layout-header-background': '#ffffff',
      '@layout-footer-background': '#ffffff',
      '@layout-header-height': '56px',
      '@layout-header-padding': '0 10px',
      '@font-family': `'Spoqa Han Sans', 'Nanum Gothic', sans-serif`,
      // '@primary-color': '#2f9bff',
    },
  }),
);

// module.exports = function override(config, env) {
//   const tsLoader = getLoader(
//     config.module.rules,
//     (rule) => rule.loader && typeof rule.loader === 'string' && rule.loader.includes('ts-loader'),
//   );
//   tsLoader.options = {
//     getCustomTransformers: () => ({
//       before: [
//         tsImportPluginFactory({
//           libraryDirectory: 'es',
//           libraryName: 'antd',
//           style: true,
//         }),
//       ],
//     }),
//   };
//
//   config = rewireLessWithModule(config, env, {
//     javascriptEnabled: true,
//     modifyVars: {
//       '@layout-body-background': '#ffffff',
//       '@layout-header-background': '#ffffff',
//       '@layout-footer-background': '#ffffff',
//       '@layout-header-height': '56px',
//       '@layout-header-padding': '0 10px',
//       '@font-family': `'Spoqa Han Sans', 'Nanum Gothic', sans-serif`,
//       // '@primary-color': '#2f9bff',
//     },
//   });
//   return config;
// };
