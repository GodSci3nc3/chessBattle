// Inicializa Chess.js para manejar el estado del tablero
const game = new Chess();


// Inicializa Chessboard.js
var board2 = Chessboard('chessboard', {
    draggable: false,
    dropOffBoard: 'trash',
    sparePieces: true,
    pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
});



// Al iniciar el juego, resetea el tablero
$('#startBtn').on('click', startGame);
$('#clearBtn').on('click', clearBoard);

// Función para reiniciar el tablero
function clearBoard() {
    game.reset();  // Resetea el estado del juego
    board2.position(game.fen());  // Actualiza el tablero con la posición inicial
}

// Función para iniciar el juego entre las IAs
async function startGame() {
    game.reset();  // Resetea el estado del juego
    board2.position(game.fen());  // Establece el tablero en la posición inicial

    // Comienza el juego entre las IAs
    playGame();
}

// Función para simular los turnos de las IAs
async function playGame() {
    while (!game.game_over()) {
        // Turno de Stockfish
        await makeMove('stockfish');
        board2.position(game.fen());  // Actualiza el tablero con la nueva jugada

        if (game.game_over()) break;

        // Turno de Lc0
        await makeMove('lc0');
        board2.position(game.fen());  // Actualiza el tablero con la nueva jugada
    }

    // Al final del juego, muestra el resultado
    alert("Juego terminado: " + game.result());
}

// Función para hacer el movimiento de una IA
async function makeMove(engine) {
  const fen = game.fen(); // Obtener la posición actual del tablero en formato FEN
  
  let uciMove = await fetch(`/move/${engine}?fen=${fen}`)
    .then(response => response.json())
    .then(data => data.move);
  
  console.log("Movimiento UCI de la IA:", uciMove); // Para verificar
  
  // Convertir movimiento UCI (como "e2e4") a formato Chess.js
  const from = uciMove.substring(0, 2);
  const to = uciMove.substring(2, 4);
  let promotion = uciMove.length > 4 ? uciMove.substring(4, 5) : undefined;
  
  // Crear objeto de movimiento para Chess.js
  const moveObj = {
    from: from,
    to: to,
    promotion: promotion
  };
  
  // Realizar el movimiento
  const move = game.move(moveObj);
  
  if (move === null) {
    console.error("Movimiento inválido:", uciMove, moveObj);
    return;
  }
  
  // Actualizar el tablero con la nueva jugada
  board2.position(game.fen());
  
  // Esperar un poco para visualizar los movimientos (opcional)
  await new Promise(resolve => setTimeout(resolve, 1000));
}


