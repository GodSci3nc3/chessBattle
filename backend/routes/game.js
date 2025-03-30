const express = require('express');
const getStockfishMove = require('./stockfish');
const getLc0Move = require('./lc0');

const router = express.Router();

router.get('/:engine', async (req, res) => {
    const engine = req.params.engine;
    const fen = req.query.fen;

    if (!fen) {
        return res.status(400).json({ error: 'FEN es obligatorio' });
    }

    try {
        let move;
        if (engine === 'stockfish') {
            move = await getStockfishMove(fen);  // Debería devolver algo como "e2e4"
        } else if (engine === 'lc0') {
            move = await getLc0Move(fen);  // También debería devolver algo como "e2e4"
        } else {
            return res.status(400).json({ error: 'Motor no válido' });
        }

        return res.json({ move });  // Asegúrate de devolver solo la jugada
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});


module.exports = router;
