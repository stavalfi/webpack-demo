const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    plugins: [
        // automatically installing & saving dependencies from my source code when using `import` or `require`.
        new NpmInstallPlugin({
            // Use --save or --save-dev
            dev: false,
            // Install missing peerDependencies
            peerDependencies: true,
            // Reduce amount of console logging
            quiet: false,
            // npm command used inside company, yarn is not supported yet
            npm: 'tnpm'
        }),
        new HtmlWebpackPlugin({
            title: "Webpack demo",
        }),
    ],
    devServer: {
        overlay: true, // capturing compilation related warnings and errors and show them instead of showing my actual website.
        // Display only errors to reduce the amount of output.
        stats: "errors-only",

        // Parse host and port from env to allow customization.
        //
        // If you use Docker, Vagrant or Cloud9, set
        // host: options.host || "0.0.0.0";
        //
        // 0.0.0.0 is available to all network devices
        // unlike default `localhost`.
        host: process.env.HOST, // Defaults to `localhost`
        port: process.env.PORT, // Defaults to 8080
        open: true, // Open the page in browser
    },
};