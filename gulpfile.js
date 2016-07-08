var gulp = require("gulp"),
    uglify = require("gulp-uglify"),
    concat = require("gulp-concat"),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    rimraf = require("rimraf");

var paths = {
    webroot: ""
};

paths.distFolder = paths.webroot + "dist";
paths.srcFolder = paths.webroot + "src/*.js";
paths.concatJsDist = paths.webroot + "dist/popup-directive.js";

gulp.task("clean:js", function(cb) {
    return rimraf(paths.distFolder, cb);
});

gulp.task("min:js", ["clean:js"], function () {
    return gulp.src([paths.srcFolder])
       .pipe(sourcemaps.init())
       .pipe(concat(paths.concatJsDist))
       .pipe(gulp.dest("."))
       .pipe(uglify())
       .pipe(rename({ extname: '.min.js' }))
       .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '../' }))
       .pipe(gulp.dest("."));
});

gulp.task("build", ["min:js"], function () {

});