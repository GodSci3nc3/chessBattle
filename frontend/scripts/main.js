var board2 = Chessboard('board2', {
    draggable: false,
    dropOffBoard: 'trash',
    sparePieces: true,
    pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
  })
  
  $('#startBtn').on('click', board2.start)
  $('#clearBtn').on('click', board2.clear)

  async function makeMove(engine) {
    const fen = game.fen();  // Obtener la posición actual del tablero en formato FEN

    let move = await fetch(`/move/${engine}?fen=${fen}`)  // Llamada al backend
        .then(response => response.json())
        .then(data => data.move);

    // Realizar el movimiento en el juego
    game.ugly_move(game.move(move));
}
