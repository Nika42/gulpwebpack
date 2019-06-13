const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const connect = require("gulp-connect");
const webpackStream = require("webpack-stream");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const autoprefixer = require("autoprefixer");

gulp.task("server", () =>
    connect.server({
        root: "public",
        livereload: true
    })
);

gulp.task("html", () =>
    gulp
        .src("src/*.html")
        .pipe(gulp.dest("public"))
        .pipe(connect.reload())
);

gulp.task("style", () =>
    gulp
        .src("src/style/index.scss")
        .pipe(sourcemaps.init())
        .pipe(
            sass({
                // outputStyle: "expanded"
            }).on("error", sass.logError)
        )
        .pipe(
            postcss([
                autoprefixer({
                    overrideBrowserslist: ["last 4 version"],
                    cascade: false
                }),
                cssnano({
                    preset: [
                        "default",
                        {
                            discardComments: {
                                removeAll: true
                            }
                        }
                    ]
                })
            ])
        )
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("public/css/"))
        .pipe(connect.reload())
);

gulp.task("webpack", () =>
    gulp
        .src("src/js/index.js")
        .pipe(webpackStream(require("./webpack.config.js"), require("webpack")))
        .pipe(gulp.dest("public/js/"))
        .pipe(connect.reload())
);

gulp.task("default", ["server", "html", "style", "webpack"], () => {
    gulp.watch(["src/style/**/*.scss"], ["style"]);
    gulp.watch(["src/js/**/*.js"], ["webpack"]);
    gulp.watch("src/*.html", ["html"]);
});
