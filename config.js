System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  paths: {
    "d:*": "dist-dev/*",
    "n:*": "node_modules/*"
  },
  map: {
    'app': 'd:app',
    'rxjs': 'n:rxjs',
    '@angular/core': 'n:@angular/core/bundles/core.umd.js',
    '@angular/common': 'n:@angular/common/bundles/common.umd.js',
    '@angular/compiler': 'n:@angular/compiler/bundles/compiler.umd.js',
    '@angular/platform-browser': 'n:@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'n:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
    '@angular/http': 'n:@angular/http/bundles/http.umd.js',
    '@angular/router': 'n:@angular/router/bundles/router.umd.js',
    '@angular/forms': 'n:@angular/forms/bundles/forms.umd.js',

    'es6-promise': 'n:es6-promise',
    'es6-shim': 'n:es6-shim',
    'ie-shim': 'n:ie-shim',
    'reflect-metadata': 'n:reflect-metadata',
    'ng2-translate': 'node_modules/ng2-translate/bundles',
    'crypto': 'n:crypto-js',
    'plugin-babel': 'node_modules/systemjs-plugin-babel/plugin-babel.js',
    'zone.js': 'n:zone.js',
    'systemjs-babel-build': 'node_modules/systemjs-plugin-babel/systemjs-babel-browser.js',
    'systemjs': 'node_modules/systemjs/dist/system.src.js',
    'system-polyfills': 'node_modules/systemjs/dist/system-polyfills.js',
    'es6-module-loader': 'node_modules/es6-module-loader/dist/es6-module-loader.js'
  },
  packages: {
    'app': {main: 'boot.js', defaultExtension: 'js', format: 'register'},
    'rxjs': {main: 'Rx.js', defaultExtension: 'js'},
    'es6-promise': {main: 'dist/es6-promise.js', defaultExtension: 'js'},
    'es6-shim': {main: 'es6-shim.js', defaultExtension: 'js'},
    'ie-shim': {main: 'dist/browser.js', defaultExtension: 'js'},
    'crypto': {main: 'index.js', defaultExtension: 'js'},
    'reflect-metadata': {main: 'Reflect.js', defaultExtension: 'js'}
  }
});