const myBoard = document.querySelector('#board2');

const startPosition = {
  a3: 'wP',
  b3: 'wP',
  c3: 'wP',
  d3: 'wP',
  e3: 'wP',
  f3: 'wP',
  g3: 'wP',
  h3: 'wP',
  e1: 'wK',
  d1: 'wQ',
  d8: 'bQ',
  e8: 'bK',
  a6: 'bP',
  b6: 'bP',
  c6: 'bP',
  d6: 'bP',
  e6: 'bP',
  f6: 'bP',
  g6: 'bP',
  h6: 'bP',

};

function onDrop(source, target, piece, newPos, oldPos, orientation) {
  console.log({
    source, target, piece, newPos, oldPos, orientation,
  });
  // Zakaz zbijania swoich pionków
  if (oldPos[target]) {
    if (oldPos[target][0] === piece[0]) {
      return 'snapback';
    }
  }
}

function onMoveEnd(oldPos, newPos) {
  console.log('Move animation complete:');
  console.log(`Old position: ${Chessboard.objToFen(oldPos)}`);
  console.log(`New position: ${Chessboard.objToFen(newPos)}`);
}
const config = {
  position: startPosition,
  draggable: true,
  dropOffBoard: 'snapback',
  sparePieces: false,
  onMoveEnd,
  onDrop,
};

let board2 = Chessboard(myBoard, config);
console.log(board2);

$('#startBtn').on('click', () => board2 = Chessboard(myBoard, config));

$('#clearBtn').on('click', board2.destroy);
