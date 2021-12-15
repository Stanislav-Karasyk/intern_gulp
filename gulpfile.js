const { src, dest, parallel, series, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const scss = require("gulp-sass")(require("sass"));
const ts = require("gulp-typescript");
const tsProject = ts.createProject("./tsconfig.json");
const rename = require("gulp-rename");
const cleancss = require("gulp-clean-css");
const del = require('del');

function browsersync() {
  browserSync.init({
    server: { baseDir: "./src" },
    notify: false,
    online: true,
  });
}

function compileTs() {
  return src("./src/ts/**/*.ts")
    .pipe(tsProject())
    .js.pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest("./src/js"))
    .pipe(browserSync.stream());
}

function compileScss() {
  return src("./src/scss/*.scss")
    .pipe(concat("styles.css"))
    .pipe(scss())
    .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest("./src/css"))
    .pipe(browserSync.stream());
}

function startWatch() {
  watch(["./src/scss/*.scss"], compileScss);
  watch(["./src/ts/*.ts"], compileTs);
}

function startBuild() {
  return src(
    ["./src/css/styles.min.css", "./src/js/*.min.js", "./src/index.html"],
    { base: "src" }
  ).pipe(dest("dist"));
}

function cleanDist() {
  return del("./dist", { force: true });
}


exports.build = series(cleanDist, compileScss, compileTs, startBuild);

exports.default = parallel(compileTs, compileScss, browsersync, startWatch);
