exports.devServer = ({ host, port } = {}) => ({
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
        host: host, // Defaults to `localhost`
        port: port, // Defaults to 8080
        open: true, // Open the page in browser
    },
});