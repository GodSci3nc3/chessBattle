const { spawn } = require('child_process');
require('dotenv').config();

const STOCKFISH_PATH = process.env.STOCKFISH_PATH || '/usr/games/stockfish';

function getStockfishMove(fen) {
    return new Promise((resolve, reject) => {
        const stockfish = spawn(STOCKFISH_PATH);

        stockfish.stdin.write('uci\n');  // Inicializa el motor en modo UCI
        stockfish.stdin.write(`position fen ${fen}\n`);  // Carga la posición actual
        stockfish.stdin.write('go depth 15\n');  // Le pide calcular la mejor jugada

        stockfish.stdout.on('data', (data) => {
            const output = data.toString();
            const match = output.match(/bestmove (\S+)/);
            if (match) {
                resolve(match[1]);  // Devuelve la mejor jugada
                stockfish.kill();
            }
        });

        stockfish.stderr.on('data', (data) => {
            console.error(`Stockfish error: ${data}`);
        });

        stockfish.on('exit', (code) => {
            if (code !== 0) {
                reject('Stockfish process exited with error');
            }
        });
    });
}

module.exports = getStockfishMove;
