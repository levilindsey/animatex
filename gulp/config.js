const appName = 'animatex';

const config = {};

config.srcPath = 'src';
config.distPath = 'dist';
config.nodeModulesPath = 'node_modules';

config.publicPath = config.srcPath;

config.scriptsDist = `${config.distPath}`;
config.sourceMapsDist = '.';

config.scriptDistFileName = `${appName}.js`;

config.distGlob = `${config.distPath}/**`;

config.mainScriptSrc = `${config.publicPath}/index.js`;
config.scriptsSrc = [
  config.mainScriptSrc,
  `${config.publicPath}/**/*.js`,
];

config.buildTasks = [
  'scripts',
];

//config.host = '0.0.0.0';
config.host = 'localhost';
config.port = 8080;

export default config;
