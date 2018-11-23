const tsImportPluginFactory = require('ts-import-plugin');
const { getLoader } = require('react-app-rewired');
const rewireLessWithModule = require('react-app-rewire-less-with-modules')

module.exports = function override(config, env) {
  const tsLoader = getLoader(
    config.module.rules,
    rule =>
      rule.loader &&
      typeof rule.loader === 'string' &&
      rule.loader.includes('ts-loader')
  );
  tsLoader.options = {
    getCustomTransformers: () => ({
      before: [
        tsImportPluginFactory({
          libraryDirectory: 'es',
          libraryName: 'antd',
          style: true
        })
      ]
    })
  };

  config = rewireLessWithModule(config, env, {
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#2f9bff',
      '@layout-body-background': '#ffffff',
      '@layout-header-background': '#131313',
      '@layout-footer-background': '#ffffff'
    }
  });
  return config;
};