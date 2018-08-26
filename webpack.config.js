const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        filename: "bundle.js"
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: [
                    "node_modules",
                    "webpack.config.js",
                    "dist"
                ]
            },
            {
                test: /\.ts$/,
                enforce: 'pre',
                use: [
                    {
                        loader: 'tslint-loader',
                        options: {
                            // tslint errors are displayed by default as warnings
                            // set emitErrors to true to display them as errors
                            emitErrors: true,
                            // tslint does not interrupt the compilation by default
                            // if you want any file with tslint errors to fail
                            // set failOnHint to true
                            failOnHint: true,
                            // enables type checked rules like 'for-in-array'
                            // uses tsconfig.json from current working directory
                            typeCheck: true,
                            // automatically fix linting errors
                            fix: true,
                        }
                    }
                ],
                exclude: [
                    "node_modules",
                    "webpack.config.js",
                    "dist"
                ]
            }
        ]
    },
    plugins: [
        // generate a html file after every time webpack end
        new HtmlWebpackPlugin({
            title: "Webpack demo",
        }),
        // put all the css files in one css file and not in the js files because js files can take time until they load so mean while the css are not loaded.
        // in this way, the browser can manage the process by him self because css and js are in different files.
        // it's currently not emitting css files - bug in thier plugin.
        new MiniCssExtractPlugin({
            // [name] will be the name of the entry file which defined in the webpack.config.js
            filename: "[name].css",
        })
    ],
    devServer: {
        overlay: true, // capturing compilation related warnings and errors and show them instead of showing my actual website.
        stats: "errors-only",
        host: process.env.HOST,
        port: process.env.PORT,
        open: true, // Open the page in browser
    },
};
