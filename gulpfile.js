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

// 使用 webpack 生成文件
gulp.task("webpack", function() {

  return gulp
    .src("index.html")
    .pipe(gulpWebpack(webpackConf, wepback))
    .pipe(gulp.dest("tmp"));
});

// 压缩 js
gulp.task("uglify:js", function() {

  pump([
    gulp.src(["tmp/*.js"]),
    sourcemaps.init(),
    uglify(),
    sourcemaps.write(".", {
      mapFile: function(mapFilePath) {
        return mapFilePath.replace(".js.map", ".map.js");
      }
    }),
    gulp.dest("tmp")
  ]);
});

// 压缩 css
gulp.task("uglify:css", function() {
  pump([
    gulp.src("tmp/*.css"),
    sourcemaps.init(),
    cleanCss(),
    sourcemaps.write(".", {
      mapFile: function(mapFilePath) {
        return mapFilePath.replace(".css.map", ".map.css");
      }
    }),
    gulp.dest("tmp")
  ]);
});

// 复制文件
gulp.task("cp:js", function() {
  return gulp.src("tmp/*.js").pipe(copy("dist/js", { prefix: 1}));
})

gulp.task("cp:css", function() {
  return gulp.src("tmp/*.css").pipe(copy("dist/css", {prefix: 1}));
})

// 清空文件
gulp.task("clean:dist", function() {
  return del(["dist/js/**", "dist/css/**"]);
})

// 清空缓存文件
gulp.task("clean:tmp", function() {
  return del("tmp/**");
})

gulp.task("default", 
  gulpSequence(
    "clean:dist", 
    "webpack", 
    ["uglify:js", "uglify:css"], 
    ["cp:js", "cp:css"], 
    "clean:tmp"
  )
);