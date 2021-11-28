const myBoard = document.querySelector('#board');
const winner = document.querySelector('.winner');
const startAgainBTN = document.querySelector('.startBtn');

let turn = true; // True is white turn
let gameOver = false;

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

const letterToNumber = (sign) => {
  switch (sign) {
    case 'a':
      return 1;
    case 'b':
      return 2;
    case 'c':
      return 3;
    case 'd':
      return 4;
    case 'e':
      return 5;
    case 'f':
      return 6;
    case 'g':
      return 7;
    case 'h':
      return 8;
    default:
      return undefined;
  }
};

const NumberToLetter = [
  undefined,
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  undefined,
];

const position = (onePos) => {
  const place = onePos[0];
  const vertical = Number(place[1]);
  const inline = place[0];
  // inline give letter
  const inlineRight = NumberToLetter[letterToNumber(inline) + 1];
  const inlineLeft = NumberToLetter[letterToNumber(inline) - 1];

  // Crooss
  const frontRight = `${inlineRight}${vertical + 1}`;
  const frontLeft = `${inlineLeft}${vertical + 1}`;
  const backRight = `${inlineRight}${vertical - 1}`;
  const backLeft = `${inlineLeft}${vertical - 1}`;

  // Vertical
  const front = `${inline}${vertical + 1}`;
  const back = `${inline}${vertical - 1}`;

  // inline

  const right = `${inlineRight}${vertical}`;
  const left = `${inlineLeft}${vertical}`;

  return {
    front,
    back,
    frontRight,
    frontLeft,
    backRight,
    backLeft,
    right,
    left,
    vertical,
    inline,
    inlineRight,
    inlineLeft,
    place,
  };
};

const generateArrForWait = (ourPawnAndPosition, white, black, color) => {
  const possibleMoves = [];
  const allies = (color === 'white') ? white : black;
  const enemies = (color === 'white') ? black : white;

  ourPawnAndPosition.forEach((onePos) => {
    // position
    const {
      frontRight,
      frontLeft,
      backRight,
      backLeft,
      right,
      left,
      back,
      front,
      vertical,
      inlineLeft,
      inlineRight,
      place,
    } = position(onePos);
    const king = (color === 'white') ? 'wK' : 'bK';
    const queen = (color === 'white') ? 'wQ' : 'bQ';
    const pawn = (color === 'white') ? [
      'wP', front, frontRight, frontLeft] : ['bP', back, backRight, backLeft];
    // console.log(vertical > 1 && vertical < 8)


    // if places ahed dont have ahe pown
    if (onePos[1] === pawn[0]) {
      if (!enemies.includes(`${pawn[1]}`) && vertical > 1 && vertical < 8 && !allies.includes(`${pawn[1]}`)) {
        possibleMoves.push([place, pawn[1]]);
      }

      if (inlineRight && enemies.includes(`${pawn[2]}`) && !allies.includes(`${pawn[2]}`)) {
        possibleMoves.push([place, pawn[2]]);
      }

      if (inlineLeft && enemies.includes(`${pawn[3]}`) && !allies.includes(`${pawn[3]}`)) {
        possibleMoves.push([place, pawn[3]]);
      }
    }

    // for side on Queen and king
    if (onePos[1] === queen || onePos[1] === king) {
      // front
      if (vertical < 8 && !allies.includes(`${front}`)) {
        possibleMoves.push([place, front]);
      }
      // back
      if (vertical > 1 && !allies.includes(`${back}`)) {
        possibleMoves.push([place, back]);
      }
      // right
      if (inlineRight && !allies.includes(`${right}`)) {
        possibleMoves.push([place, right]);
      }
      // left
      if (inlineLeft && !allies.includes(`${left}`)) {
        possibleMoves.push([place, left]);
      }
    }
    // for side for queen(cross)
    if (onePos[1] === queen) {
      // Front Right
      if (vertical < 8 && inlineRight && !allies.includes(`${frontRight}`)) {
        possibleMoves.push([place, frontRight]);
      }
      // front Left
      if (vertical < 8 && inlineRight && !allies.includes(`${frontLeft}`)) {
        possibleMoves.push([place, frontLeft]);
      }
      // back Right
      if (vertical > 1 && inlineRight && !allies.includes(`${backRight}`)) {
        possibleMoves.push([place, backRight]);
      }
      // back left
      if (vertical > 1 && inlineRight && !allies.includes(`${backLeft}`)) {
        possibleMoves.push([place, backLeft]);
      }
    }
  });
  return possibleMoves;
};



const onDragStart = (source, piece) => {
  if (turn && piece.search(/^b/) !== -1) {
    return false;
  }
};

const levelUpPawn = (newPos) => {
  const newPosition = newPos;
  const x = Object.entries(newPosition);

  x.forEach((el) => {
    const field = el[0];
    const pawn = el[1];

    if (Number(field[1]) === 1 && pawn === 'bP') {
      newPosition[field] = 'bQ';
      const fen = Chessboard.objToFen(newPosition);
      board.position(fen);
    } else if (Number(field[1]) === 8 && pawn === 'wP') {
      newPosition[field] = 'wQ';
      const fen = Chessboard.objToFen(newPosition);
      board.position(fen);
    }
  });
};

const onMoveEnd = (oldPos, newPos) => {
  levelUpPawn(newPos);
};

const checkWinner = (whiteMoves, blackMoves) => {
  const allPowns = Object.values(board.position());
  if (blackMoves.length === 0 || !allPowns.includes('bK')) {
    winner.textContent = 'White Win';
    gameOver = true;
  } else if (whiteMoves.length === 0 || !allPowns.includes('wK')) {
    winner.textContent = 'Black Win';
    gameOver = true;
  }
};

function possibleMove() {
  const allPositionArr2D = Object.entries(board.position());
  const blackPosition = [];
  const whitePosition = [];

  // sort places witch black pawns
  const blackPawnAndPosition = allPositionArr2D.filter((el) => {
    if (el[1] === 'bP' || el[1] === 'bQ' || el[1] === 'bK') {
      blackPosition.push(el[0]);
      return el;
    }
  });
  // sort places with white pawns
  const whitePawnAndPosition = allPositionArr2D.filter((el) => {
    if (el[1] === 'wP' || el[1] === 'wQ' || el[1] === 'wK') {
      whitePosition.push(el[0]);
      return el;
    }
  });
  const whiteMoves = generateArrForWait(whitePawnAndPosition, whitePosition, blackPosition, 'white');
  const blackMoves = generateArrForWait(blackPawnAndPosition, whitePosition, blackPosition, 'black');

  checkWinner(whiteMoves, blackMoves);

  return {
    blackMoves,
    whiteMoves,
  };
}

const fight = () => {
  const { blackMoves } = possibleMove();
  if (blackMoves.length === 0 || gameOver) {
    return;
  }
  const randomMove = Math.floor(Math.random() * (blackMoves.length));
  const drawnMove = blackMoves[randomMove];
  board.move(`${drawnMove[0]}-${drawnMove[1]}`);
  turn = true;
};

const onDrop = (source, target) => {
  const { whiteMoves } = possibleMove();
  if (whiteMoves.length === 0 || gameOver) {
    return 'snapback';
  }
  const actualMove = [source, target];
  let isLegalMove = false;
  // check legal Moves for white player
  if (turn) {
    whiteMoves.forEach((el) => {
      if (JSON.stringify(el) === JSON.stringify(actualMove)) {
        isLegalMove = true;
      }
    });

    if (isLegalMove) {
      turn = false;
      setTimeout(fight, 200);

      return true;
    }
    return 'snapback';
  }
  return 'snapback';
};

const config = {
  position: startPosition,
  draggable: true,
  dropOffBoard: 'snapback',
  sparePieces: false,
  onDrop,
  onDragStart,
  onMoveEnd,
  orientation: 'white',
};

const board = new Chessboard(myBoard, config);

startAgainBTN.addEventListener('click', () => {
  winner.textContent = '';
  board.position(startPosition);
  gameOver = false;
  turn = true;
});
