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


// Configuración de la ventana modal
const modal = document.getElementById('result-modal');
const closeModal = document.querySelector('.close-modal');
const newGameBtn = document.getElementById('new-game-btn');

closeModal.onclick = function() {
  modal.style.display = "none";
}

newGameBtn.onclick = function() {
  modal.style.display = "none";
  startGame();
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

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
    moveCount = 0;
    document.getElementById('log-list').innerHTML = '';

    playGame();
}

// Función para determinar el resultado del juego
function getGameResult() {
  if (game.in_checkmate()) {
    // Determinar quién ganó basado en el turno
    return game.turn() === 'w' ? "Leela (lc0) ha ganado por jaque mate" : "Stockfish ha ganado por jaque mate";
  } else if (game.in_draw()) {
    if (game.in_stalemate()) {
      return "Empate por ahogado";
    } else if (game.in_threefold_repetition()) {
      return "Empate por triple repetición";
    } else if (game.insufficient_material()) {
      return "Empate por material insuficiente";
    } else {
      return "Empate por regla de 50 movimientos";
    }
  } else {
    return "Partida finalizada";
  }
}

// Mostrar resultado en la ventana modal
function showResultModal(result) {
  const resultMessage = document.getElementById('result-message');
  const resultTitle = document.getElementById('result-title');
  const resultAnimation = document.getElementById('result-animation');
  
  resultMessage.textContent = result;
  
  // Personalizar el título y la animación según el resultado
  if (result.includes("Stockfish ha ganado")) {
    resultTitle.textContent = "¡Victoria de Stockfish!";
    resultTitle.style.color = "#d6a145"; // Color dorado
    resultAnimation.innerHTML = '<i class="fas fa-trophy" style="color: #d6a145; font-size: 4rem;"></i>';
  } else if (result.includes("Leela (lc0) ha ganado")) {
    resultTitle.textContent = "¡Victoria de Leela!";
    resultTitle.style.color = "#808080"; // Color gris
    resultAnimation.innerHTML = '<i class="fas fa-trophy" style="color: #808080; font-size: 4rem;"></i>';
  } else {
    resultTitle.textContent = "Empate";
    resultTitle.style.color = "#3498db"; // Color azul
    resultAnimation.innerHTML = '<i class="fas fa-handshake" style="color: #3498db; font-size: 4rem;"></i>';
  }
  
  modal.style.display = "block";
}

async function playGame() {
  if (game.game_over()) {
    const result = getGameResult();
    showResultModal(result);
    return;
  }

  while (!game.game_over()) {
      await makeMove('stockfish');
      board2.position(game.fen());  

      if (game.game_over()) break;  

      await makeMove('lc0');
      board2.position(game.fen()); 
  }

  const result = getGameResult();
  showResultModal(result);
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