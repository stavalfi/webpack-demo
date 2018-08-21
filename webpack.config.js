const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./src/index.ts",
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
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader"],
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
        new HtmlWebpackPlugin({
            title: "Webpack demo",
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
