const path = require("path");
const gulp = require("gulp");
const gulpSequence = require("gulp-sequence");
const del = require("del");
const copy = require("gulp-copy");
const clean = require("gulp-clean");
const uglify = require("gulp-uglify");
const webpack = require("webpack");
const gulpWebpack = require("webpack-stream");
const webpackConf = require("./webpack.config.js");
const cleanCss =require("gulp-clean-css");
const pump = require("pump");
const sourcemaps = require("gulp-sourcemaps");
const rev = require("gulp-rev");
const revcssurl = require("gulp-rev-css-url");
const rename = require("gulp-rename");

// 使用 webpack 生成文件
gulp.task("webpack", function() {

  return gulp
    .src("index.html")
    .pipe(gulpWebpack(webpackConf, webpack))
    .pipe(gulp.dest("tmp"));
});

// 压缩 js
gulp.task("uglify:js", function(cbk) {

  pump([
    gulp.src(["tmp/*.js"]),
    rename(function(fileInfo) {
      fileInfo.basename += ".min";
    }),
    sourcemaps.init(),
    uglify(),
    sourcemaps.write(".", {
      mapFile: function(mapFilePath) {
        return mapFilePath.replace(".js.map", ".map.js");
      }
    }),
    gulp.dest("tmp")
  ], cbk);
});

// 压缩 css
gulp.task("uglify:css", function(cbk) {
  pump([
    gulp.src("tmp/*.css"),
    rename(function(fileInfo) {
      fileInfo.basename += ".min";
    }),
    sourcemaps.init(),
    cleanCss(),
    sourcemaps.write(".", {
      mapFile: function(mapFilePath) {
        return mapFilePath.replace(".css.map", ".map.css");
      }
    }),
    gulp.dest("tmp")
  ], cbk);
});

// 复制文件
gulp.task("cprev:js", function() {
  return gulp.src("rev/*.js").pipe(copy("dist/js", { prefix: 1}));
})

gulp.task("cprev:css", function() {
  return gulp.src("rev/*.css").pipe(copy("dist/css", {prefix: 1}));
})

gulp.task("cprev:images", function() {
  return gulp.src("rev/images/*").pipe(copy("dist/css", { prefix: 1}));
})

gulp.task("cptmp:js", function() {
  return gulp.src("tmp/*.js").pipe(copy("dist/js", { prefix: 1}));
})

gulp.task("cptmp:css", function() {
  return gulp.src("tmp/*.css").pipe(copy("dist/css", {prefix: 1}));
})

gulp.task("cptmp:images", function() {
  return gulp.src("tmp/images/*").pipe(copy("dist/css", { prefix: 1}));
})

// 清理文件
gulp.task("clean:dist", function() {
  return del(["dist/js/**", "dist/css/**"]);
})

gulp.task("clean:tmp", function() {
  return del("tmp");
})

gulp.task("clean:rev", function() {
  return del("rev");
})

// 添加 md5 值
gulp.task("rev", function(cbk) {

  return gulp.src(["tmp/**/*"])
    .pipe(rev())
    .pipe(revcssurl())
    .pipe(gulp.dest("rev"))
    .pipe(rev.manifest())
    .pipe(gulp.dest("rev"));
})

gulp.task("default", 
  gulpSequence(
    ["clean:dist", "clean:tmp", "clean:rev"],
    "webpack",
    ["uglify:js", "uglify:css"],
    // "rev",
    ["cptmp:js", "cptmp:css", "cptmp:images"],
    ["clean:tmp", "clean:rev"]
  )
);