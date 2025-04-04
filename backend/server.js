const express = require("express");
const path = require("path");
const cors = require("cors");
const getStockfishMove = require("./routes/stockfish");
const getLc0Move = require("./routes/lc0");

const app = express();
const port = 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, '../frontend'), {
    setHeaders: function (res, filePath) {
        if (filePath.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');  
        }
    }
}));

app.get("/move/:engine", async (req, res) => {
    const { engine } = req.params;
    const { fen } = req.query;

    if (!fen) {
        return res.status(400).json({ error: "FEN es obligatorio" });
    }

    try {
        let move;
        if (engine === "stockfish") {
            move = await getStockfishMove(fen);  // Obtiene la jugada de Stockfish
        } else if (engine === "lc0") {
            move = await getLc0Move(fen);  // Obtiene la jugada de Lc0
        } else {
            return res.status(400).json({ error: "Motor no válido" });
        }

        return res.json({ move });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al calcular la jugada" });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
