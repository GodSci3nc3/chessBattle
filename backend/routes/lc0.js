const { spawn } = require("child_process");
require("dotenv").config();

const LC0_PATH = process.env.LC0_PATH || "/home/arthur/chess-engines/lc0/build/release/lc0";
const ENGINE_TIMEOUT = process.env.ENGINE_TIMEOUT || 30000; // 30 seconds timeout
function getLc0Move(fen) {
    return new Promise((resolve, reject) => {
        try {
            const lc0 = spawn(LC0_PATH, [], { stdio: ['pipe', 'pipe', 'pipe'] });
            let engineOutput = "";
            let uciSent = false;
            let uciokReceived = false;
            let isreadySent = false;
            let readyokReceived = false;
            let positionSent = false;
            let goSent = false;
            
            // Set timeout
            const timeout = setTimeout(() => {
                lc0.kill();
                reject(new Error("Engine operation timed out"));
            }, ENGINE_TIMEOUT);
            
            // Handle process errors
            lc0.on("error", (error) => {
                clearTimeout(timeout);
                reject(new Error(`Failed to start Lc0 engine: ${error.message}`));
            });
            
            // Handle process exit
            lc0.on("exit", (code, signal) => {
                clearTimeout(timeout);
                if (code !== 0 && !signal) {
                    reject(new Error(`Lc0 process exited with code ${code}`));
                }
            });
            
            // Process both stdout and stderr as engine output
            const processEngineOutput = (data) => {
                const output = data.toString();
                engineOutput += output;
                
                // Log engine output for debugging
                console.log(`Lc0: ${output.trim()}`);
                
                // Check for uciok after sending uci
                if (uciSent && !uciokReceived && engineOutput.includes("uciok")) {
                    uciokReceived = true;
                    // Now send isready command
                    lc0.stdin.write("isready\n");
                    isreadySent = true;
                }
                
                // Check for readyok after sending isready
                if (isreadySent && !readyokReceived && engineOutput.includes("readyok")) {
                    readyokReceived = true;
                    // Now send position command
                    lc0.stdin.write(`position fen ${fen}\n`);
                    positionSent = true;
                    // Send go command immediately after position
                    lc0.stdin.write("go nodes 1000\n");
                    goSent = true;
                }
                
                // Check for bestmove
                const match = output.match(/bestmove (\S+)/);
                if (match) {
                    clearTimeout(timeout);
                    resolve(match[1]);
                    lc0.kill();
                }
            };
            
            // Handle stdout data
            lc0.stdout.on("data", processEngineOutput);
            
            // Handle stderr data
            lc0.stderr.on("data", processEngineOutput);
            
            // Start UCI protocol
            lc0.stdin.write("uci\n");
            uciSent = true;
        } catch (error) {
            reject(new Error(`Error initializing Lc0 engine: ${error.message}`));
        }
    });
}

module.exports = getLc0Move;
