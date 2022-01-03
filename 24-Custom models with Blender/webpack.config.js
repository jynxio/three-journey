const path = require("path");
const html_wepack_plugin = require("html-webpack-plugin");

module.exports = {
    entry: "./source/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "./build"),
        clean: true,
    },
    plugins: [
        new html_wepack_plugin({
            title: ""
        }),
    ],
    mode: "development",
    devtool: "eval-source-map",
    devServer: {
        static: "./",
        compress: true,
        server: "http",
        port: 8080,
        open: true,
        hot: true,
        liveReload: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource"
            },
            {
                test: /\.(csv|tsv)$/i,
                use: ["csv-loader"],
            },
            {
                test: /\.xml$/i,
                use: ["xml-loader"],
            },
        ],
    },
};