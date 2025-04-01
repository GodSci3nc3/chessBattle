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

// Variables para el cronómetro
let gameStartTime = 0;
let moveStartTime = 0;
let timerInterval = null;
let totalElapsedTime = '00:00.0';
let currentEngine = '';

// Crear y agregar el elemento del cronómetro en el HTML
const timerHTML = `
  <div id="timer-container">
    <div class="timer-wrapper">
      <div class="timer-block">
        <div class="timer-label">
          <span id="current-engine">Esperando...</span> está pensando
        </div>
      </div>
      <div class="timer-block">
        <div class="timer-label">Tiempo total:</div>
        <div id="timer" class="timer">00:00.0</div>
      </div>
    </div>
  </div>
`;

// Insertar el HTML del temporizador justo después del tablero
document.querySelector('.button-group').insertAdjacentHTML('afterend', timerHTML);

// Crear y agregar HTML de la ventana modal al documento
const modalHTML = `
  <div id="result-modal" class="modal">
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2 id="result-title">Partida Finalizada</h2>
      <p id="result-message"></p>
      <div id="final-time">Tiempo total: <span id="final-time-value">00:00.0</span></div>
      <div id="result-animation"></div>
      <button id="new-game-btn">Nueva Partida</button>
    </div>
  </div>
`;
document.body.insertAdjacentHTML('beforeend', modalHTML);

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

// Funciones para el cronómetro
function startGameTimer() {
  // Iniciar el cronómetro del juego
  gameStartTime = Date.now();
  timerInterval = setInterval(updateTimer, 100);
}

function startEngineTurn(engine) {
  // Actualizar el motor actual y guardar el tiempo de inicio del movimiento
  currentEngine = engine;
  document.getElementById('current-engine').textContent = engine;
  document.getElementById('current-engine').className = engine.toLowerCase() === 'stockfish' ? 'engine-stockfish' : 'engine-leela';
  moveStartTime = Date.now();
}

function stopEngineTurn() {
  if (moveStartTime > 0 && currentEngine) {
    // Calcular cuánto tiempo tomó el movimiento
    const moveDuration = calculateMoveDuration();
    updateLastLogItemWithTime(moveDuration);
  }
}

function calculateMoveDuration() {
  const elapsedMs = Date.now() - moveStartTime;
  const minutes = Math.floor(elapsedMs / 60000);
  const seconds = Math.floor((elapsedMs % 60000) / 1000);
  const tenths = Math.floor((elapsedMs % 1000) / 100);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${tenths}`;
}

function stopGameTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  // Guardar el tiempo final
  document.getElementById('final-time-value').textContent = totalElapsedTime;
}

function updateTimer() {
  const elapsedMs = Date.now() - gameStartTime;
  const minutes = Math.floor(elapsedMs / 60000);
  const seconds = Math.floor((elapsedMs % 60000) / 1000);
  const tenths = Math.floor((elapsedMs % 1000) / 100);
  
  totalElapsedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${tenths}`;
  document.getElementById('timer').textContent = totalElapsedTime;
}

function updateLastLogItemWithTime(time) {
  const logList = document.getElementById('log-list');
  const lastLogItem = logList.lastElementChild;
  
  if (lastLogItem) {
    // Crear elemento de tiempo
    const timeSpan = document.createElement('span');
    timeSpan.className = 'move-time';
    timeSpan.textContent = time;
    
    // Crear elemento de tiempo total
    const totalTimeSpan = document.createElement('span');
    totalTimeSpan.className = 'total-time';
    totalTimeSpan.textContent = totalElapsedTime;
    
    // Añadir tiempos al último elemento de log
    lastLogItem.appendChild(document.createTextNode(' - Duración: '));
    lastLogItem.appendChild(timeSpan);
    lastLogItem.appendChild(document.createTextNode(' - Tiempo total: '));
    lastLogItem.appendChild(totalTimeSpan);
  }
}

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
    
    // Detener el cronómetro
    stopGameTimer();
    document.getElementById('timer').textContent = '00:00.0';
    document.getElementById('current-engine').textContent = 'Esperando...';
    document.getElementById('current-engine').className = '';
}

async function startGame() {
    game.reset();  
    board2.position(game.fen());  
    moveCount = 0;
    document.getElementById('log-list').innerHTML = '';
    
    // Reiniciar y comenzar el cronómetro
    stopGameTimer();
    document.getElementById('timer').textContent = '00:00.0';
    document.getElementById('current-engine').textContent = 'Esperando...';
    document.getElementById('current-engine').className = '';
    
    // Iniciar el cronómetro del juego
    startGameTimer();

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
  
  // Detener el cronómetro cuando se muestra el resultado
  stopGameTimer();
  
  modal.style.display = "block";
}

async function playGame() {
  if (game.game_over()) {
    const result = getGameResult();
    showResultModal(result);
    return;
  }

  while (!game.game_over()) {
      // Indicar que es el turno de Stockfish
      startEngineTurn('Stockfish');
      
      await makeMove('stockfish');
      board2.position(game.fen());
      
      if (game.game_over()) break;
      
      // Indicar que es el turno de Leela
      startEngineTurn('Leela');
      
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
  
  // Detener el turno después de recibir la respuesta
  stopEngineTurn();
  
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