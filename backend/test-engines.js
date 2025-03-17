const getStockfishMove = require("./routes/stockfish");
const getLc0Move = require("./routes/lc0");

const testFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"; // Posición inicial del ajedrez

async function testEngines() {
    console.log("Probando Stockfish...");
    try {
        const stockfishMove = await getStockfishMove(testFen);
        console.log(`Stockfish sugiere: ${stockfishMove}`);
    } catch (error) {
        console.error("Error con Stockfish:", error);
    }

    console.log("\nProbando Lc0...");
    try {
        const lc0Move = await getLc0Move(testFen);
        console.log(`Lc0 sugiere: ${lc0Move}`);
    } catch (error) {
        console.error("Error con Lc0:", error);
    }
}

testEngines();
