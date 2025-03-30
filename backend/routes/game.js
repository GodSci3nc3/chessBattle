const express = require('express');
const getStockfishMove = require('./stockfish');
const getLc0Move = require('./lc0');

const router = express.Router();

// Endpoint para manejar la jugada de Stockfish o Lc0
router.get('/:engine', async (req, res) => {
    const engine = req.params.engine;
    const fen = req.query.fen;  // Obtener la posición del tablero en FEN

    if (!fen) {
        return res.status(400).json({ error: 'FEN es obligatorio' });
    }

    try {
        let move;
        if (engine === 'stockfish') {
            move = await getStockfishMove(fen);  // Obtiene la jugada de Stockfish
        } else if (engine === 'lc0') {
            move = await getLc0Move(fen);  // Obtiene la jugada de Lc0
        } else {
            return res.status(400).json({ error: 'Motor no válido' });
        }

        res.json({ move });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

module.exports = router;
