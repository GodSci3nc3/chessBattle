document.addEventListener("DOMContentLoaded", function () {
    var boardElement = document.getElementById("board");

    if (!boardElement) {
        console.error("Error: No se encontró el elemento #board en el DOM.");
        return;
    }

    var board = Chessboard('board', {
        position: 'start', 
        draggable: true,    
        dropOffBoard: 'snapback' 
    });

    async function getAIMove(engine) {
        const fen = board.position();  
        const response = await fetch(`http://localhost:3000/next-move?engine=${engine}&fen=${fen}`);
        const data = await response.json();

        if (data.move) {
            board.move(data.move);  
            console.log(`${engine} mueve: ${data.move}`);
        }
    }

    async function aiTurn() {
        await getAIMove('stockfish');  
        await getAIMove('lc0');        
    }


    setInterval(aiTurn, 3000);

    
    document.getElementById("reset-btn").addEventListener("click", function () {
        board.position('start');
    });
});
