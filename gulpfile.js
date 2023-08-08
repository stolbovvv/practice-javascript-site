import path from 'path';
import gulp from 'gulp';
import babel from 'gulp-babel';
import terser from 'gulp-terser';
import rename from 'gulp-rename';
import gulpzip from 'gulp-zip';
import postcss from 'gulp-postcss';
import browserSync from 'browser-sync';
import cssnanoPlugin from 'cssnano';
import postcssPresetEnv from 'postcss-preset-env';
import postcssSortMediaQueries from 'postcss-sort-media-queries';
import { deleteSync as del } from 'del';

const { init, stream, reload } = browserSync.create();
const { src, dest, watch, series, parallel } = gulp;

// Settings: "Mode"
const MODE = process.env.NODE_ENV?.trim() || 'development';
const MODE_DEV = MODE === 'development';
const MODE_PROD = MODE === 'production';

// Settings: "Dir"
const DIR_ROOT = path.basename(path.resolve());
const DIR_BUILD = 'dist';
const DIR_SOURCE = 'src';

// Task: "Styles"
const handleStyles = () => {
  return src([`${DIR_SOURCE}/styles/*.css`, `!${DIR_SOURCE}/styles/*.min.css`], { sourcemaps: MODE_DEV })
    .pipe(postcss([postcssPresetEnv({ autoprefixer: { grid: true } }), postcssSortMediaQueries()]))
    .pipe(dest(`${DIR_BUILD}/styles/`))
    .pipe(postcss([cssnanoPlugin()]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(`${MODE_PROD ? DIR_BUILD : DIR_SOURCE}/styles/`, { sourcemaps: '.' }))
    .pipe(stream());
};

// Task: "Scripts"
const handleScripts = () => {
  return src([`${DIR_SOURCE}/scripts/*.js`, `!${DIR_SOURCE}/scripts/*.min.js`], { sourcemaps: MODE_DEV })
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(dest(`${DIR_BUILD}/scripts/`))
    .pipe(terser({ keep_fnames: true, mangle: false }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(`${MODE_PROD ? DIR_BUILD : DIR_SOURCE}/scripts/`, { sourcemaps: '.' }))
    .pipe(stream());
};

// Task: "Copy"
const runCopy = () => {
  return src(
    [`${DIR_SOURCE}/*.*`, `${DIR_SOURCE}/fonts/**/*`, `${DIR_SOURCE}/images/**/*`, `${DIR_SOURCE}/icons/**/*`],
    {
      base: `${DIR_SOURCE}/`,
    },
  ).pipe(dest(`${DIR_BUILD}/`));
};

// Task: "Archive"
const runArchive = () => {
  return src(`${DIR_BUILD}/**/*`)
    .pipe(gulpzip(`${DIR_ROOT}.zip`))
    .pipe(dest('.'));
};

// Task: "Clean"
const runClean = (out) => {
  del(`${DIR_BUILD}/*`);
  del(`${DIR_ROOT}.zip`);
  return out();
};

// Task: "Server"
const runServer = () => {
  init({
    server: {
      baseDir: `${DIR_SOURCE}/`,
    },
    notify: false,
    open: false,
    port: 1234,
    ui: false,
  });
};

// Task: "Watcher"
const runWatcher = () => {
  watch([`${DIR_SOURCE}/styles/**/*.css`, `!${DIR_SOURCE}/styles/**/*.min.css`], handleStyles);
  watch([`${DIR_SOURCE}/scripts/**/*.js`, `!${DIR_SOURCE}/scripts/**/*.min.js`], handleScripts);

  watch([`${DIR_SOURCE}/*.*`]).on('add', reload);
  watch([`${DIR_SOURCE}/*.*`]).on('change', reload);

  watch([`${DIR_SOURCE}/{fonts, icons, images}/**/*.*`]).on('add', reload);
  watch([`${DIR_SOURCE}/{fonts, icons, images}/**/*.*`]).on('change', reload);
};

// Gulp base scripts:
export const clean = series(runClean);
export const build = series(runClean, handleStyles, handleScripts, runCopy);
export const archive = series(runClean, handleStyles, handleScripts, runCopy, runArchive);

// Gulp default script:
export default series(parallel(handleStyles, handleScripts), parallel(runServer, runWatcher));
