import {registerShutdownCallback} from "../registerShutdownCallback";

const liveServer = require("live-server");

async function main() {

    const params = {
        port: 9000,
        host: "0.0.0.0",
        root: "./dist",
        open: true,
        wait: 600,
        middleware: [function (req, res, next) {
            next();
        }]
    };

    // if main app shuts down, we explicitly tell live-server to shut down too
    registerShutdownCallback(() => {
        liveServer.shutdown();
    });

    // TODO: promisify this somehow
    liveServer.start(params);
}

export const serve = () => {
    main();
}