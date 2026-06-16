import Signals = NodeJS.Signals;

async function sleep(ms: number) {

    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

const SHUTDOWN_SIGNALS: Array<Signals> = [
    'SIGHUP',
    'SIGINT',
    'SIGTERM',
    // 'SIGKILL'
];

const SHUTDOWN_TIMEOUT: number = 15000;
const SHUTDOWN_WAIT_BEFORE: number = 600;
type BeforeShutdownCallback = (signalOrEvent: string) => any;

const callbacks: Array<BeforeShutdownCallback> = [];

async function shutdown(code: Signals) {

    // just end it if it takes too long...
    setTimeout(() => {
        process.exit(1);
    }, SHUTDOWN_TIMEOUT);

    for (const listener of callbacks) {

        try {
            await listener(code);
        } catch (e) {
            console.error(e);
        }
    }

    await sleep(SHUTDOWN_WAIT_BEFORE);

    process.exit(0);
}

function registerShutdownEventListeners() {

    (SHUTDOWN_SIGNALS as Signals[]).forEach((signal: Signals) => {

        process.once(signal, async function () {
            console.log(`Caught ${signal}`);
            await shutdown(signal);
        });

    });
}

// register only once
registerShutdownEventListeners();

export const registerShutdownCallback = (callback: BeforeShutdownCallback) => {
    callbacks.push(callback);
}