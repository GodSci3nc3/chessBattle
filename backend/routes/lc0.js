const { spawn } = require('child_process');
require('dotenv').config();

const LC0_PATH = process.env.LC0_PATH || '/home/arthur/chess-engines/lc0/build/release/lc0';

function getLc0Move(fen) {
    return new Promise((resolve, reject) => {
        const lc0 = spawn(LC0_PATH);

        lc0.stdin.write('uci\n');
        lc0.stdin.write(`position fen ${fen}\n`);
        lc0.stdin.write("go nodes 500\n");  // Leela piensa hasta analizar 1000 nodos

        lc0.stdout.on('data', (data) => {
            const output = data.toString();
            const match = output.match(/bestmove (\S+)/);
            if (match) {
                resolve(match[1]);
                lc0.kill();
            }
        });

        lc0.stderr.on('data', (data) => {
            console.error(`Lc0 error: ${data}`);
        });

        lc0.on('exit', (code) => {
            if (code !== 0) {
                reject('Lc0 process exited with error');
            }
        });
    });
}

module.exports = getLc0Move;
