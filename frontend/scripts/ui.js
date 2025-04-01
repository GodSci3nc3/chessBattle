document.addEventListener('DOMContentLoaded', function() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
      const header = item.querySelector('.accordion-header');
      
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        accordionItems.forEach(accordItem => {
          accordItem.classList.remove('active');
        });
        
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  
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
    
    const stockfishStatus = document.getElementById('stockfish-status');
    const leelaStatus = document.getElementById('leela-status');
    const engineThinking = document.getElementById('engine-thinking');
    
    const startBtn = document.getElementById('startBtn');
    const downloadPgn = document.getElementById('download-pgn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    if (startBtn) {
      startBtn.addEventListener('click', function() {
        if (stockfishStatus && leelaStatus) {
          stockfishStatus.textContent = 'Activo';
          stockfishStatus.classList.add('active');
          
          setTimeout(() => {
            stockfishStatus.textContent = 'Pensando';
            stockfishStatus.classList.remove('active');
            stockfishStatus.classList.add('thinking');
            
            if (engineThinking) {
              engineThinking.querySelector('p').textContent = 'StockFish está calculando su movimiento...';
            }
          }, 500);
        }
        
        startTimer();
        
        document.getElementById('current-player').textContent = 'StockFish';
        document.getElementById('current-player').className = 'engine-stockfish';
      });
    }
    
    if (downloadPgn) {
      downloadPgn.addEventListener('click', function() {
        const pgn = game.pgn();  
        
        const blob = new Blob([pgn], { type: 'text/plain' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);  
        link.download = 'partida.pgn';  
        
        link.click();
    
        alert('Descarga de notación PGN iniciada');
      });
    }
    
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
    
    const newGameBtn = document.getElementById('new-game-btn');
    const modal = document.getElementById('result-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (newGameBtn && modal) {
      newGameBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        
      });
    }
    
    if (closeModal && modal) {
      closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
      });
    }
    
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
    
    const shareResultBtn = document.getElementById('share-result-btn');
    if (shareResultBtn) {
      shareResultBtn.addEventListener('click', function() {
        alert('Función de compartir no disponible en modo de demostración');
      });
    }
  });