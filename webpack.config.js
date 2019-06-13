const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    name: "release",
    mode: "development",
    devtool: "source-map",
    entry: {
        index: path.resolve("src/js/index.js")
    },
    output: {
        path: path.join(__dirname, "public"),
        filename: "[name].js",
        sourceMapFilename: "[name].map"
    },
    optimization: {
        splitChunks: false
    },
    resolve: {
        modules: ["src/js/", "node_modules"]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /\/node_modules\//,
                include: path.join(__dirname, "src/js/"),
                loader: "babel-loader",
                options: {
                    babelrc: false,
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                targets: {
                                    browsers: [
                                        "Chrome >= 55",
                                        "ChromeAndroid >= 55",
                                        "Firefox >= 51",
                                        "FirefoxAndroid >= 54",
                                        "Safari >= 9",
                                        "Edge >= 12",
                                        "IE 8",
                                        "iOS >= 9.2",
                                        "Android >= 4"
                                    ]
                                }
                            }
                        ]
                    ]
                }
            }
        ]
    },
    plugins: [
        new UglifyJsPlugin({
            sourceMap: true,
            uglifyOptions: {
                ecma: 5,
                compress: true,
                mangle: true,
                output: {
                    comments: false,
                    beautify: true
                }
            }
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ]
};
