import gulp from "gulp";
import gulpCopy from "gulp-copy";
import terser from "gulp-terser";

gulp.task("minify", () => {
  return gulp
    .src(["dist/**/*.js", "!dist/template/**/*"], { dot: true })
    .pipe(terser())
    .pipe(gulp.dest("dist/"));
});

gulp.task("copy-assets", () => {
  return (
    gulp
      // dot必须设置，scan .[fileName][.ext]
      .src("src/template/**/*", { dot: true })
      .pipe(gulpCopy("dist/", { prefix: 1 }))
  );
});

gulp.task("default", gulp.series("copy-assets", "minify"));
