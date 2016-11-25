var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    typescript = require('gulp-typescript'),
    babel = require('gulp-babel'),
    clean = require('gulp-clean'),
    jspm = require('gulp-jspm-build'),
    concat = require('gulp-concat'),
    seq = require('run-sequence'),
    browserSync = require('browser-sync'),
    bsDev = require("./bs-config.dev"),
    bsProd = require("./bs-config.prod"),
    less = require('gulp-less'),
    nodemon = require('gulp-nodemon'),
    tslint = require("gulp-tslint");

var clientConfig = require('./src/app/tsconfig.json');
var serverConfig = require('./src/server/tsconfig.json');

const BROWSER_SYNC_DELAY = 500;

var paths = {
  scripts: ['src/app/**/*.ts'],
  server: ['src/server/server-app.ts','typings/index.d.ts'],
  styles: ['src/app/**/*.less'],
  translations: ['src/assets/i18n/**/*.json', 'src/assets/materialize/**/*.*', 'src/assets/img/**/*.*'],
  typings: ['typings/**/*.*']
};


// order make sense
var polyfills = [
  'node_modules/reflect-metadata/Reflect.js',
  'node_modules/systemjs/dist/system.src.js',
  'node_modules/es6-promise/dist/es6-promise.js',
  'node_modules/es6-shim/es6-shim.js',
  'node_modules/ie-shim/dist/browser.js',
  'node_modules/zone.js/dist/zone.js'
];

var DEV = {src: 'src/assets/dev/**/*.*', dst: 'dist-dev', dstCopy: 'dist-dev/app'};
var PROD = {src: 'src/assets/prod/**/*.*', dst: 'dist', dstCopy: 'dist/app'};
var SERV = {src: 'src/server/**/*.*', dst: 'server'};

gulp.task('default', function () {
    return seq('dev', 'dev:watch', 'dev:bs')
});

gulp.task('build', ['prod'], function () {
});

gulp.task('dev', function () {
  return seq('dev:clean',
      [
        'dev:bundle:styles',
        'dev:assets',
        'dev:assets:translations',
        // 'dev:assets:materialize',
        'dev:polyfills',
        'dev:scripts'
      ]
  );
});

gulp.task('prod', function () {
  return seq('prod:clean',
      'lint',
      [
        'prod:bundle:styles',
        'prod:assets',
        'prod:assets:translations',
        'prod:assets:materialize',
        'prod:polyfills',
        'prod:scripts'
      ]
  );
});

gulp.task('clean', ['dev:clean', 'prod:clean', 'serv:clean']);

gulp.task('dev:clean', function () {
  return gulp.src([DEV.dst], {read: false})
      .pipe(clean());
});

gulp.task('prod:clean', function () {
    return gulp.src([PROD.dst], {read: false})
        .pipe(clean());
});

gulp.task('serv:clean', function () {
    return gulp.src([SERV.dst], {read: false})
        .pipe(clean());
});

gulp.task('dev:bundle:styles', function() {
  return bundleStyles()
      .pipe(gulp.dest(DEV.dst))
});

gulp.task('prod:bundle:styles', function() {
  return bundleStyles()
      .pipe(gulp.dest(PROD.dst))
});

gulp.task('dev:assets', function () {
  return gulp.src(DEV.src)
      .pipe(gulp.dest(DEV.dst));
});

gulp.task('prod:assets', function () {
  return gulp.src(PROD.src)
      .pipe(gulp.dest(PROD.dst));
});

gulp.task('dev:assets:translations', function() {
  return gulp.src(paths.translations, {base: 'src/assets'})
      .pipe(gulp.dest(DEV.dst));
});

gulp.task('dev:assets:materialize', function() {
  return gulp.src(paths.materialize, {base: 'src/assets'})
    .pipe(gulp.dest(DEV.dst));
});

gulp.task('prod:assets:translations', function() {
  return gulp.src(paths.translations, {base: 'src/assets'})
      .pipe(gulp.dest(PROD.dst));
});

gulp.task('prod:assets:materialize', function() {
  return gulp.src(paths.materialize, {base: 'src/assets'})
    .pipe(gulp.dest(PROD.dst));
});


gulp.task("dev:polyfills", function () {
  return bundlePolyfills()
      .pipe(gulp.dest(DEV.dst));
});

/*gulp.task("typings_to_client", () => {
  return gulp.src(paths.typings, {base: './'})
      .pipe(gulp.dest('dist'))
 });*/

gulp.task("prod:polyfills", function () {
  return bundlePolyfills()
      .pipe(gulp.dest(PROD.dstCopy));
});

gulp.task('move_ts_to_client', function() { //['typings_to_client'],
  return gulp.src(paths.scripts)
      .pipe(gulp.dest(DEV.dstCopy));
});

gulp.task('dev:scripts', ['move_ts_to_client'], function () {
  return gulp.src(paths.scripts)
      .pipe(sourcemaps.init())
      .pipe(typescript(clientConfig.compilerOptions))
      .pipe(babel({
        presets: ['babel-preset-es2015'].map(require.resolve)
      }))
      .pipe(sourcemaps.write('.', {sourceRoot: 'src'}))
      .pipe(gulp.dest(DEV.dst));
});

gulp.task("lint", function () {
      return gulp.src(paths.scripts)
          .pipe(tslint({formatter: "prose"}))
          .pipe(tslint.report())
    }
);

gulp.task("prod:scripts", ["dev:scripts", "prod:polyfills"], function () {
  return jspm({
    bundleOptions: {
      minify: true,
      mangle: true
    },
    bundleSfx: true,
    bundles: [
      {src: 'app', dst: 'bundle.min.js'}
    ]
  }).pipe(gulp.dest(PROD.dst));
});

gulp.task('dev:watch', function () {
  gulp.watch(paths.scripts, ['dev:scripts']);
  gulp.watch(paths.styles, ['dev:bundle:styles']);
  gulp.watch(paths.translations, ['dev:assets:translations']);
  gulp.watch([DEV.src], ['dev:assets']);
});

gulp.task('prod:watch', function () {
  gulp.watch(paths.scripts, ['prod:scripts']);
  gulp.watch(paths.styles, ['prod:bundle:styles']);
  gulp.watch([PROD.src], ['prod:assets']);
});

gulp.task('dev:bs', ['dev:serve'], function () {
  browserSync.create()
      .init(bsDev);
});

gulp.task('prod:bs', ['prod:serve'], function () {
  browserSync.create()
      .init(bsProd);
});

gulp.task('dev:serve', ['server:compile'], function(cb) {
    var started = false;
    gulp.watch(SERV.src,['server:compile']);
    return nodemon({
        script: 'server/server-app.js',
        watch: 'server',
        env: {
            'NODE_ENV': 'development'
        }
    }).on('start', function () {
        if (!started) {
            cb();
            started = true;
        }
    }).on('restart', function() {
        setTimeout(function() {
            browserSync.reload({stream: false});
        }, BROWSER_SYNC_DELAY);
    });
});

gulp.task("prod:serve", ['server:compile'], function(cb) {
    var started = false;
    gulp.watch(SERV.src,['server:compile']);
    return nodemon({
        script: 'server/server-app.js',
        watch: 'server',
        env: {
            'NODE_ENV': 'production'
        }
    }).on('start', function () {
        if (!started) {
            cb();
            started = true;
        }
    }).on('restart', function() {
        setTimeout(function() {
            browserSync.reload({stream: false});
        }, BROWSER_SYNC_DELAY);
    });
});

gulp.task("server:compile", function() {
    return gulp.src(paths.server)
        .pipe(sourcemaps.init())
        .pipe(typescript(serverConfig.compilerOptions))
        .pipe(babel({
            presets: ['babel-preset-es2015'].map(require.resolve)
        }))
        .pipe(sourcemaps.write('.', {sourceRoot: '.'}))
        .pipe(gulp.dest(SERV.dst));

});

function bundlePolyfills(){
  return gulp.src(polyfills)
      .pipe(concat('polyfills.min.js'))
}

function bundleStyles(){
  return gulp.src(paths.styles)
      .pipe(sourcemaps.init())
      .pipe(less())
      .pipe(sourcemaps.write())
      .pipe(concat("bundle.css"))
}
