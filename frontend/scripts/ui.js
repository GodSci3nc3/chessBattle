// Script de UI complementario (ui.js)
document.addEventListener('DOMContentLoaded', function() {
    // Manejar el acordeón de FAQ
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
      const header = item.querySelector('.accordion-header');
      
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Cerrar todos los acordeones activos
        accordionItems.forEach(accordItem => {
          accordItem.classList.remove('active');
        });
        
        // Si el elemento clicado no estaba activo, activarlo
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  
    // Inicializar gráfico de estadísticas si existe el elemento
    const chartCanvas = document.getElementById('results-chart');
    if (chartCanvas) {
      const ctx = chartCanvas.getContext('2d');
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['StockFish', 'Leela', 'Tablas'],
          datasets: [{
            data: [483, 451, 309],
            backgroundColor: [
              'rgba(255, 215, 0, 0.7)',
              'rgba(192, 192, 192, 0.7)',
              'rgba(100, 100, 100, 0.7)'
            ],
            borderColor: [
              'rgba(255, 215, 0, 1)',
              'rgba(192, 192, 192, 1)',
              'rgba(100, 100, 100, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#f1efef',
                font: {
                  family: 'Poppins',
                  size: 14
                },
                padding: 20
              }
            },
            tooltip: {
              backgroundColor: 'rgba(30, 30, 34, 0.9)',
              titleColor: '#f1efef',
              bodyColor: '#f1efef',
              padding: 15,
              boxPadding: 10,
              cornerRadius: 6,
              titleFont: {
                family: 'Poppins',
                size: 14,
                weight: 'bold'
              },
              bodyFont: {
                family: 'Poppins',
                size: 13
              },
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }
    
    // Simulación de estado de los motores
    const stockfishStatus = document.getElementById('stockfish-status');
    const leelaStatus = document.getElementById('leela-status');
    const engineThinking = document.getElementById('engine-thinking');
    
    // Inicializar manejadores de botones
    const startBtn = document.getElementById('startBtn');
    const downloadPgn = document.getElementById('download-pgn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    if (startBtn) {
      startBtn.addEventListener('click', function() {
        // Actualizar indicadores de estado al iniciar
        if (stockfishStatus && leelaStatus) {
          stockfishStatus.textContent = 'Activo';
          stockfishStatus.classList.add('active');
          
          // Simular que Stockfish está pensando primero
          setTimeout(() => {
            stockfishStatus.textContent = 'Pensando';
            stockfishStatus.classList.remove('active');
            stockfishStatus.classList.add('thinking');
            
            if (engineThinking) {
              engineThinking.querySelector('p').textContent = 'StockFish está calculando su movimiento...';
            }
          }, 500);
        }
        
        // Iniciar el contador
        startTimer();
        
        // Actualizar el turno actual
        document.getElementById('current-player').textContent = 'StockFish';
        document.getElementById('current-player').className = 'engine-stockfish';
      });
    }
    
    if (downloadPgn) {
      downloadPgn.addEventListener('click', function() {
        // Simular descarga de PGN
        alert('Descarga de notación PGN iniciada');
        
        // En una implementación real, aquí generarías el archivo PGN
        // y lo ofrecerías como descarga
      });
    }
    
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', function() {
        alert('Análisis de partida no disponible en modo de demostración');
      });
    }
    
    // Función para el temporizador
    let timer;
    let seconds = 0;
    
    function startTimer() {
      if (timer) clearInterval(timer);
      
      seconds = 0;
      updateTimerDisplay();
      
      timer = setInterval(() => {
        seconds++;
        updateTimerDisplay();
      }, 1000);
    }
    
    function updateTimerDisplay() {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      
      const formattedTime = 
        `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
      
      const timerElement = document.getElementById('timer');
      if (timerElement) {
        timerElement.textContent = formattedTime;
      }
    }
    
    // Manejar el scroll suave para los enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
    
    // Manejar botón "Nueva Partida" en el modal
    const newGameBtn = document.getElementById('new-game-btn');
    const modal = document.getElementById('result-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (newGameBtn && modal) {
      newGameBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        
        // En una implementación real, aquí reiniciarías el juego
      });
    }
    
    if (closeModal && modal) {
      closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
      });
    }
    
    // Cerrar el modal al hacer clic fuera de él
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
    
    // Simular compartir resultado
    const shareResultBtn = document.getElementById('share-result-btn');
    if (shareResultBtn) {
      shareResultBtn.addEventListener('click', function() {
        alert('Función de compartir no disponible en modo de demostración');
      });
    }
  });