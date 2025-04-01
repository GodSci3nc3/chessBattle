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
let totalElapsedTime = '00:00';
let currentEngine = '';

// Usar los elementos existentes en el HTML en lugar de crear nuevos
const timerElement = document.getElementById('timer');
const currentPlayerElement = document.getElementById('current-player');
const totalMovesElement = document.getElementById('total-moves');
const totalTimeElement = document.getElementById('total-time');

// Referencias a los estados de los motores
const stockfishStatus = document.getElementById('stockfish-status');
const leelaStatus = document.getElementById('leela-status');
const engineThinking = document.getElementById('engine-thinking');

// Configuración de la ventana modal (que ya existe en el HTML)
const modal = document.getElementById('result-modal');
const closeModal = document.querySelector('.close-modal');
const newGameBtn = document.getElementById('new-game-btn');
const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');
const resultBadge = document.getElementById('result-badge');

document.getElementById('toggle-console').addEventListener('click', function() {
  const consolePanel = document.getElementById('console-panel');
  const chevronIcon = this.querySelector('i');
  
  if (consolePanel.classList.contains('collapsed')) {
    consolePanel.classList.remove('collapsed');
    chevronIcon.className = 'fas fa-chevron-up';
  } else {
    consolePanel.classList.add('collapsed');
    chevronIcon.className = 'fas fa-chevron-down';
  }
});

// Funciones para el cronómetro
function startGameTimer() {
  gameStartTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000); // Actualizar cada segundo
}

function startEngineTurn(engine) {
  currentEngine = engine;
  
  // Actualizar el jugador actual en la interfaz
  if (currentPlayerElement) {
    currentPlayerElement.textContent = engine;
    currentPlayerElement.className = engine.toLowerCase() === 'stockfish' ? 'engine-stockfish' : 'engine-leela';
  }
  
  // Actualizar los indicadores de estado
  if (engine.toLowerCase() === 'stockfish') {
    stockfishStatus.textContent = 'Pensando';
    stockfishStatus.className = 'status-indicator thinking';
    leelaStatus.textContent = 'Esperando';
    leelaStatus.className = 'status-indicator';
  } else {
    leelaStatus.textContent = 'Pensando';
    leelaStatus.className = 'status-indicator thinking';
    stockfishStatus.textContent = 'Esperando';
    stockfishStatus.className = 'status-indicator';
  }
  
  // Actualizar el mensaje de pensamiento
  if (engineThinking) {
    engineThinking.querySelector('p').textContent = `${engine} está calculando su movimiento...`;
  }
  
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
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function stopGameTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  // Actualizar el tiempo total en el modal de resultados
  if (totalTimeElement) {
    totalTimeElement.textContent = totalElapsedTime;
  }
}

function updateTimer() {
  const elapsedMs = Date.now() - gameStartTime;
  const minutes = Math.floor(elapsedMs / 60000);
  const seconds = Math.floor((elapsedMs % 60000) / 1000);
  
  totalElapsedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  if (timerElement) {
    timerElement.textContent = totalElapsedTime;
  }
}

function updateLastLogItemWithTime(time) {
  const logList = document.getElementById('log-list');
  const lastLogItem = logList.lastElementChild;
  
  if (lastLogItem) {
    // Crear elemento de tiempo
    const timeSpan = document.createElement('span');
    timeSpan.className = 'move-time';
    timeSpan.textContent = time;
    
    // Añadir tiempo al último elemento de log
    lastLogItem.appendChild(document.createTextNode(' - Tiempo: '));
    lastLogItem.appendChild(timeSpan);
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
  logItem.appendChild(document.createTextNode(' '));
  logItem.appendChild(engineSpan);
  logItem.appendChild(document.createTextNode(` movió: ${move}`));
  
  logList.appendChild(logItem);
  
  // Actualizar el contador de movimientos
  if (totalMovesElement) {
    totalMovesElement.textContent = moveCount;
  }
  
  // Auto-scroll al último item
  const consoleContent = document.getElementById('console-content');
  consoleContent.scrollTop = consoleContent.scrollHeight;
}

function clearBoard() {
    game.reset();  
    board2.position(game.fen());
    
    // Restablecer el contador de movimientos
    moveCount = 0;
    if (totalMovesElement) {
      totalMovesElement.textContent = '0';
    }
    
    // Detener el cronómetro
    stopGameTimer();
    if (timerElement) {
      timerElement.textContent = '00:00';
    }
    
    // Restablecer los estados
    stockfishStatus.textContent = 'Esperando';
    stockfishStatus.className = 'status-indicator';
    leelaStatus.textContent = 'Esperando';
    leelaStatus.className = 'status-indicator';
    
    if (currentPlayerElement) {
      currentPlayerElement.textContent = '-';
      currentPlayerElement.className = '';
    }
    
    // Limpiar el log
    document.getElementById('log-list').innerHTML = '';
    
    // Restablecer el mensaje de pensamiento
    if (engineThinking) {
      engineThinking.querySelector('p').textContent = 'Esperando inicio del juego...';
    }
}

async function startGame() {
    clearBoard();
    
    // Iniciar el cronómetro del juego
    startGameTimer();

    playGame();
}

// Función para determinar el resultado del juego
function getGameResult() {
  if (game.in_checkmate()) {
    // Determinar quién ganó basado en el turno
    return game.turn() === 'w' ? "Leela lc0" : "StockFish";
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
  // Detener el cronómetro cuando se muestra el resultado
  stopGameTimer();
  
  // Personalizar el título y la animación según el resultado
  if (result === "StockFish") {
    resultTitle.textContent = "¡Victoria de StockFish!";
    resultMessage.textContent = "StockFish ha ganado por jaque mate";
    resultBadge.innerHTML = '<i class="fas fa-trophy" style="color: #d9a066;"></i>';
    resultBadge.className = 'result-badge stockfish-win';
  } else if (result === "Leela lc0") {
    resultTitle.textContent = "¡Victoria de Leela lc0!";
    resultMessage.textContent = "Leela ha ganado por jaque mate";
    resultBadge.innerHTML = '<i class="fas fa-trophy" style="color: #c0c0c0;"></i>';
    resultBadge.className = 'result-badge leela-win';
  } else {
    resultTitle.textContent = "Empate";
    resultMessage.textContent = result;
    resultBadge.innerHTML = '<i class="fas fa-handshake"></i>';
    resultBadge.className = 'result-badge draw';
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
      // Indicar que es el turno de Stockfish
      startEngineTurn('StockFish');
      
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
  
  // Simular una demora para hacer más realista el "pensamiento" de la IA
  const thinkingTime = Math.random() * 2000 + 1000; // Entre 1 y 3 segundos
  await new Promise(resolve => setTimeout(resolve, thinkingTime));
  
  // En una implementación real, aquí harías una llamada a la API para obtener el movimiento
  // Por ahora, generamos un movimiento aleatorio
  let moves = game.moves({ verbose: true });
  let move = moves[Math.floor(Math.random() * moves.length)];
  
  let uciMove = move.from + move.to;
  if (move.promotion) uciMove += move.promotion;
  
  console.log(`Movimiento de ${engine}:`, uciMove); 
  logMoveToConsole(engine === 'stockfish' ? 'StockFish' : 'Leela', uciMove);
  
  // Detener el turno después de recibir la respuesta
  stopEngineTurn();
  
  const moveObj = {
    from: move.from,
    to: move.to,
    promotion: move.promotion
  };
  
  game.move(moveObj);
  board2.position(game.fen());
  
  // Pequeña pausa antes del siguiente movimiento
  await new Promise(resolve => setTimeout(resolve, 500));
}

// Si hay botones de cierre modal, asignar eventos
if (closeModal) {
  closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
  });
}

if (newGameBtn) {
  newGameBtn.addEventListener('click', function() {
    modal.style.display = 'none';
    startGame();
  });
}

// Cerrar el modal al hacer clic fuera de él
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

// Inicialización para el botón de descargar PGN
const downloadPgnBtn = document.getElementById('download-pgn');
if (downloadPgnBtn) {
  downloadPgnBtn.addEventListener('click', function() {
    // Crear un archivo PGN con la notación de la partida
    const pgn = game.pgn();
    const blob = new Blob([pgn], { type: 'application/x-chess-pgn' });
    const url = URL.createObjectURL(blob);
    
    // Crear un enlace temporal para la descarga
    const a = document.createElement('a');
    a.href = url;
    a.download = `chess-battle-${new Date().toISOString().slice(0, 10)}.pgn`;
    document.body.appendChild(a);
    a.click();
    
    // Limpiar
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  });
}

// Inicialización para el botón de análisis
const analyzeBtn = document.getElementById('analyzeBtn');
if (analyzeBtn) {
  analyzeBtn.addEventListener('click', function() {
    alert('La función de análisis estará disponible próximamente.');
  });
}