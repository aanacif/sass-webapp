// Dependencies
const { src, dest, watch, series } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const babel = require('gulp-babel')
const terser = require('gulp-terser')
const browsersync = require('browser-sync').create()
const webp = require('gulp-webp')


//Exportng images to WebP, source folder: /images dest: dist/images
const imageExport = () => {
  return src('app/images/*.{jpg,png}')
    .pipe(webp({ quality: 75 }))
    .pipe(dest('dist/images'))
}

// Conpiling .scss files into .css files, in the /dist folder
function scssTask() {
  return src('app/scss/style.scss', { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([autoprefixer('last 2 versions'), cssnano()]))
    .pipe(dest('dist', { sourcemaps: '.' }));
}

// JavaScript Task
function jsTask() {
  return src('app/js/script.js', { sourcemaps: true })
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(terser())
    .pipe(dest('dist', { sourcemaps: '.' }));
}

// Browsersync
function browserSyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: '.',
    },
    notify: {
      styles: {
        top: 'auto',
        bottom: '0',
      },
    },
  });
  cb();
}
function browserSyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch('*.html', browserSyncReload);
  watch(
    ['app/scss/**/*.scss', 'app/**/*.js', 'app/images/*.{png,jpg}'],
    series(scssTask, jsTask, browserSyncReload, imageExport)
  );
}

// Default Gulp Task
exports.default = series(scssTask, jsTask, browserSyncServe, imageExport, watchTask);
