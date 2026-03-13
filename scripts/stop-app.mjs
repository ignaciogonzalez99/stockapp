import { execSync } from 'node:child_process';
import process from 'node:process';

const DEFAULT_PORTS = [3000, 3001];

function parsePorts(argv) {
    const explicit = argv
        .map((value) => Number.parseInt(value, 10))
        .filter((value) => Number.isInteger(value) && value > 0 && value <= 65535);

    if (explicit.length > 0) return [...new Set(explicit)];

    const envPort = Number.parseInt(process.env.PORT ?? '', 10);
    if (Number.isInteger(envPort) && envPort > 0 && envPort <= 65535) {
        return [...new Set([envPort, ...DEFAULT_PORTS])];
    }

    return DEFAULT_PORTS;
}

function findPidsOnWindows(ports) {
    let output = '';
    try {
        output = execSync('netstat -ano -p tcp', { encoding: 'utf8' });
    } catch {
        return new Set();
    }

    const pids = new Set();
    const lines = output.split(/\r?\n/);

    for (const line of lines) {
        const columns = line.trim().split(/\s+/);
        if (columns.length < 5) continue;
        if (columns[0].toUpperCase() !== 'TCP') continue;
        if (columns[3].toUpperCase() !== 'LISTENING') continue;

        const localAddress = columns[1];
        const pid = columns[4];

        for (const port of ports) {
            if (localAddress.endsWith(`:${port}`)) {
                pids.add(pid);
            }
        }
    }

    return pids;
}

function findPidsOnUnix(ports) {
    const pids = new Set();

    for (const port of ports) {
        try {
            const output = execSync(`lsof -nP -iTCP:${port} -sTCP:LISTEN -t`, { encoding: 'utf8' });
            output
                .split(/\r?\n/)
                .map((value) => value.trim())
                .filter(Boolean)
                .forEach((pid) => pids.add(pid));
        } catch {
            // No process for this port.
        }
    }

    return pids;
}

function killPidsWindows(pids) {
    for (const pid of pids) {
        try {
            execSync(`taskkill /PID ${pid} /T /F`, { stdio: 'ignore' });
            console.log(`Stopped process ${pid}.`);
        } catch {
            console.log(`Process ${pid} is not running anymore.`);
        }
    }
}

function killPidsUnix(pids) {
    for (const pid of pids) {
        try {
            execSync(`kill -TERM ${pid}`, { stdio: 'ignore' });
            console.log(`Stopped process ${pid}.`);
        } catch {
            console.log(`Process ${pid} is not running anymore.`);
        }
    }
}

function main() {
    const ports = parsePorts(process.argv.slice(2));
    const isWindows = process.platform === 'win32';
    const pids = isWindows ? findPidsOnWindows(ports) : findPidsOnUnix(ports);

    if (pids.size === 0) {
        console.log(`No app process found on ports: ${ports.join(', ')}.`);
        return;
    }

    console.log(`Stopping app process(es) on ports: ${ports.join(', ')}.`);
    if (isWindows) {
        killPidsWindows(pids);
    } else {
        killPidsUnix(pids);
    }
}

main();
