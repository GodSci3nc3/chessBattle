const game = new Chess();

var board2 = Chessboard('chessboard', {
    draggable: false,
    dropOffBoard: 'trash',
    sparePieces: false,
    pieceTheme: '/img/{piece}.png',
    boardTheme: {
      light: '#f0d9b5',
      dark: '#b58863'
    }
});

$('#startBtn').on('click', startGame);
$('#clearBtn').on('click', clearBoard);

document.getElementById('toggle-console').addEventListener('click', function() {
  const consolePanel = document.getElementById('console-panel');
  const chevronIcon = this.querySelector('i');
  
  if (consolePanel.style.height === '45px' || consolePanel.classList.contains('collapsed')) {
    consolePanel.style.height = '500px';
    consolePanel.classList.remove('collapsed');
    chevronIcon.className = 'fas fa-chevron-up';
  } else {
    consolePanel.style.height = '45px';
    consolePanel.classList.add('collapsed');
    chevronIcon.className = 'fas fa-chevron-down';
  }
});

// Función para agregar logs
let moveCount = 0;
function logMoveToConsole(engine, move) {
  moveCount++;
  const logList = document.getElementById('log-list');
  const logItem = document.createElement('li');
  
  const moveCountSpan = document.createElement('span');
  moveCountSpan.className = 'move-count';
  moveCountSpan.textContent = moveCount;
  
  const engineSpan = document.createElement('span');
  engineSpan.className = engine.toLowerCase() === 'stockfish' ? 'engine-stockfish' : 'engine-leela';
  engineSpan.textContent = engine;
  
  logItem.appendChild(moveCountSpan);
  logItem.appendChild(engineSpan);
  logItem.appendChild(document.createTextNode(` movió: ${move}`));
  
  logList.appendChild(logItem);
  
  // Auto-scroll al último item
  const consoleContent = document.getElementById('console-content');
  consoleContent.scrollTop = consoleContent.scrollHeight;
}

function adjustPiecesSize() {
  // Esperar a que las piezas estén en el DOM
  setTimeout(() => {
    // Aplicar estilos a las piezas usando su clase
    const pieces = document.querySelectorAll('.piece-417db');
    pieces.forEach(piece => {
      // Hacemos las piezas más pequeñas con transform scale
      piece.style.transform = 'scale(0.8)';
      
      // Centramos las piezas en sus casillas
      const square = piece.parentElement;
      if (square) {
        const squareRect = square.getBoundingClientRect();
        const pieceRect = piece.getBoundingClientRect();
        
        const centerX = (squareRect.width - pieceRect.width) / 2;
        const centerY = (squareRect.height - pieceRect.height) / 2;
        
        // Aseguramos que las piezas estén centradas
        piece.style.position = 'absolute';
        piece.style.left = '50%';
        piece.style.top = '50%';
        piece.style.transform = 'translate(-50%, -50%) scale(0.8)';
      }
    });
  }, 100);
}

// Función adicional para redimensionar piezas
function resizePieces() {
  // Método alternativo para redimensionar piezas
  const style = document.createElement('style');
  style.textContent = `
    .piece-417db {
      transform: scale(0.8) !important;
    }
  `;
  document.head.appendChild(style);
}

function clearBoard() {
    game.reset();  
    board2.position(game.fen());  
}

async function startGame() {
    game.reset();  
    board2.position(game.fen());  

    playGame();
}

async function playGame() {
  if (game.game_over()) {
    alert("Juego terminado: " + game.result());
    return;
  }

  while (!game.game_over()) {
      await makeMove('stockfish');
      board2.position(game.fen());  

      if (game.game_over()) break;  

      await makeMove('lc0');
      board2.position(game.fen()); 
  }

  const result = game.result(); 
  alert("Juego terminado: " + result);
}

async function makeMove(engine) {
  const fen = game.fen(); 
  
  let uciMove = await fetch(`/move/${engine}?fen=${fen}`)
    .then(response => response.json())
    .then(data => data.move);
  
  console.log("Movimiento UCI de la IA:", uciMove); 
  logMoveToConsole(engine, uciMove);
  
  const from = uciMove.substring(0, 2);
  const to = uciMove.substring(2, 4);
  let promotion = uciMove.length > 4 ? uciMove.substring(4, 5) : undefined;
  
  const moveObj = {
    from: from,
    to: to,
    promotion: promotion
  };
  
  const move = game.move(moveObj);
  
  if (move === null) {
    console.error("Movimiento inválido:", uciMove, moveObj);
    return;
  }
  
  board2.position(game.fen());
  
  await new Promise(resolve => setTimeout(resolve, 1000));
}
