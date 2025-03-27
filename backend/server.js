const express = require("express");
const path = require("path");
const cors = require("cors");
const getStockfishMove = require("./routes/stockfish");
const getLc0Move = require("./routes/lc0"); 

const app = express();
const port = 3000;


app.use(cors()); 
app.use(express.static(path.join(__dirname, '../frontend'), { 
    setHeaders: function (res, path) {
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
        }
    }
}));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.get("/next-move", async (req, res) => {
    const { engine, fen } = req.query; 

    try {
        let move;

        if (engine === "stockfish") {
            move = await getStockfishMove(fen);  
        } else if (engine === "lc0") {
            move = await getLc0Move(fen);
        } else {
            return res.status(400).json({ error: "Motor no válido" });
        }

        return res.json({ move });  
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al calcular la jugada" });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
