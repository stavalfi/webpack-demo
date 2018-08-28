const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: process.env.NODE_ENV === 'development' ? "development" : "production",
    entry: "./src/index.js",
    output: {
        // default output directory: "dist" under the main folder.
        filename: "bundle.js"
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.(jpg|jpeg)$/,
                use: {
                    // will accept imports of the above files (usually images) and if they are equal/less then the option-limit I specified, then those files
                    // will transform to strings and will be added to the JS bundle. If they are bigger then this loader will invoke file-loader (if no fall-back is defined) which will
                    // copy the file as it is a specified location.
                    // it is for making the browser to make less calls to different files other the js bundle file.
                    loader: "url-loader",
                    options: {
                        // it is for preventing the js bundle file to be too big and then the browser will need much time to load it.
                        limit: 25000,
                    },
                },
            },
            {
                test: /\.(png)$/,
                use: {
                    // will copy the file to a specified location under the output directory I specified and I need to find this file from code in there (when using imports).
                    // requirement: every file main-project-folder/X/Y/Z.abc needs to be in output-dir/X/Y/Z.abc and in the code I need to locate, relatively the this location.
                    loader: "file-loader",
                    options: {
                        name: "[path][name].[hash].[ext]",
                    },
                },
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: true
                    }
                }
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
        // it's currently not emitting css files - bug in their plugin.
        new MiniCssExtractPlugin({
            // [name] will be the name of the entry file which defined in the webpack.config.js
            filename: "[name].css",
        })
    ],
    // the dev server doesn't save any files in FS. he use in-memory FS because it is faster. so I won't find any actual bundled files in my actual FS.
    devServer: {
        overlay: true, // capturing compilation related warnings and errors and show them instead of showing my actual website.
        stats: "errors-only",
        host: process.env.HOST,
        port: process.env.PORT,
        open: true, // Open the page in browser
    },
};
