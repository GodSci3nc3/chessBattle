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

    document.getElementById("reset-btn").addEventListener("click", function () {
        board.position('start');
    });
});
