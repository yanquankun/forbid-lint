import gulp from "gulp";
import gulpCopy from "gulp-copy";

gulp.task("copy-assets", () => {
  return (
    gulp
      // dot必须设置，scan .[fileName][.ext]
      .src("src/template/**/*", { dot: true })
      .pipe(gulpCopy("dist/", { prefix: 1 }))
  );
});

gulp.task("default", gulp.series("copy-assets"));
