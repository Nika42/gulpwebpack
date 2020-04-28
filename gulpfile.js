const { src, dest, watch, parallel } = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const connect = require("gulp-connect");
const webpackStream = require("webpack-stream");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const autoprefixer = require("autoprefixer");

function server() {
	return connect.server({
		root: "public",
		livereload: true,
	});
}

function html() {
	return src("src/*.html").pipe(dest("public")).pipe(connect.reload());
}

function style() {
	return src("src/style/index.scss")
		.pipe(sourcemaps.init())
		.pipe(
			sass({
				includePaths: ["node_modules"],
			}).on("error", sass.logError)
		)
		.pipe(
			postcss([
				autoprefixer({
					overrideBrowserslist: ["last 4 version"],
					cascade: false,
				}),
				cssnano({
					preset: [
						"default",
						{
							discardComments: {
								removeAll: true,
							},
						},
					],
				}),
			])
		)
		.pipe(sourcemaps.write("."))
		.pipe(dest("public/css/"))
		.pipe(connect.reload());
}

function webpack() {
	return src("src/js/index.js")
		.pipe(webpackStream(require("./webpack.config.js"), require("webpack")))
		.pipe(dest("public/js/"))
		.pipe(connect.reload());
}

watch(["src/style/**/*.scss"], style);
watch(["src/js/**/*.js"], webpack);
watch("src/*.html", html);

exports.default = parallel(server, html, style, webpack);
