const gulp = require("gulp");
const babel = require("gulp-babel");

gulp.src("public/scripts/BeatSaber.js")
  .pipe(babel())
  .pipe(gulp.dest("public/scripts/builds/"));
