const appName = 'animatex';

const lslGulpConfig = {};

lslGulpConfig.tasks = [
  'gulp-clean',
  'gulp-default',
  'gulp-scripts'
];

lslGulpConfig.srcPath = 'src';
lslGulpConfig.distPath = 'dist';
lslGulpConfig.nodeModulesPath = 'node_modules';

lslGulpConfig.publicPath = lslGulpConfig.srcPath;

lslGulpConfig.scriptsDist = `${lslGulpConfig.distPath}`;
lslGulpConfig.sourceMapsDist = '.';

lslGulpConfig.scriptDistFileName = `${appName}.js`;

lslGulpConfig.distGlob = `${lslGulpConfig.distPath}/**`;

lslGulpConfig.mainScriptSrc = `index.js`;
lslGulpConfig.scriptsSrc = [
  lslGulpConfig.mainScriptSrc,
  `${lslGulpConfig.publicPath}/**/*.js`,
];

lslGulpConfig.buildTasks = [
  'scripts',
];

//config.host = '0.0.0.0';
lslGulpConfig.host = 'localhost';
lslGulpConfig.port = 8080;

export default lslGulpConfig;
