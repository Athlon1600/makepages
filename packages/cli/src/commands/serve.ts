import {registerShutdownCallback} from "../registerShutdownCallback";

const liveServer = require("live-server");

async function main() {

    const params = {
        port: 9000,
        host: "0.0.0.0",
        root: "./dist",
        open: true,
        wait: 300,
        middleware: [function (req, res, next) {
            next();
        }]
    };

    registerShutdownCallback(() => {
        liveServer.shutdown();
    });

    liveServer.start(params);
}

export const serve = () => {
    main();
}