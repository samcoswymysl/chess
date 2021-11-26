import { Pawns, King, Queen } from './panws.js';

const myBoard = document.querySelector('#board2');
const btn = document.querySelector('#startBtn');

/** '3qk3/8/pppppppp/8/8/PPPPPPPP/8/3QK3 b KQkq - 0 1' */

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


export default class Game {
  constructor(gamer) {
    this.gamer = gamer;
    this.turn = true;
    this.pawn = new Pawns();
    this.queen = new Queen();
    this.king = new King();

    this.startPosition = {
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
    this.config = {
      position: this.startPosition,
      draggable: true,
      dropOffBoard: 'snapback',
      sparePieces: false,
      onDrop: this.onDrop,
      orientation: 'white',
    };
    this.board = new Chessboard(myBoard, this.config);
  }

  levelUpPawn(target, piece) {
    const actualPos = this.board.position();
    for (const piece in actualPos) {
      if (Number(piece[1]) === 1 && actualPos[piece] === 'bP') {
        actualPos[piece] = 'bQ';
        // this.config.onDrop = 'trash';

        const fen = Chessboard.objToFen(actualPos);
        this.board.position(fen);
      } else if (Number(piece[1]) === 8 && actualPos[piece] === 'wP') {
        actualPos[piece] = 'wQ';
        // this.config.onDrop = 'trash';

        const fen = Chessboard.objToFen(actualPos);
        this.board.position(fen);
      }
    }
    //
    // if (target[1] === '8' || target[1] === '1') {
    //   actualPos[target] = `${piece[0]}Q`;
    //   const fen = Chessboard.objToFen(actualPos);
    //   this.board.position(fen);
    //   return 'trash';
    // }
  }

  // generate table 2d for all white moves, in el[0] old position in el[1] new position
  genereteArrForWait = (whitePownAndPosition, whitePosition, blackPosition) => {
    const whiteMoves = [];

    for (const onePos of whitePownAndPosition) {
      // position
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

      // white Pown
      // if places ahed dont have black pown
      if (onePos[1] === 'wP') {
        if (!blackPosition.includes(`${front}`) && vertical > 1 && vertical < 8 && !whitePosition.includes(`${front}`)) {
          whiteMoves.push([place, front]);
        }

        if (inlineRight && blackPosition.includes(`${frontRight}`) && !whitePosition.includes(`${frontRight}`)) {
          whiteMoves.push([place, frontRight]);
        }

        if (inlineLeft && blackPosition.includes(`${frontLeft}`) && !whitePosition.includes(`${frontLeft}`)) {
          whiteMoves.push([place, frontLeft]);
        }
      }
      // for side on Queen and king
      if (onePos[1] === 'wQ' || onePos[1] === 'wK') {
        // front
        if (vertical < 8 && !whitePosition.includes(`${front}`)) {
          whiteMoves.push([place, front]);
        }
        // back
        if (vertical > 1 && !whitePosition.includes(`${back}`)) {
          whiteMoves.push([place, back]);
        }
        // right
        if (inlineRight && !whitePosition.includes(`${right}`)) {
          whiteMoves.push([place, right]);
        }
        // left
        if (inlineLeft && !whitePosition.includes(`${left}`)) {
          whiteMoves.push([place, left]);
        }
      }
      // for side for queen(cross)
      if (onePos[1] === 'wQ') {
        // Front Right
        if (vertical < 8 && inlineRight && !whitePosition.includes(`${frontRight}`)) {
          whiteMoves.push([place, frontRight]);
        }
        // front Left
        if (vertical < 8 && inlineRight && !whitePosition.includes(`${frontLeft}`)) {
          whiteMoves.push([place, frontLeft]);
        }
        // back Right
        if (vertical > 1 && inlineRight && !whitePosition.includes(`${backRight}`)) {
          whiteMoves.push([place, backRight]);
        }
        // back left
        if (vertical > 1 && inlineRight && !whitePosition.includes(`${backLeft}`)) {
          whiteMoves.push([place, backLeft]);
        }
      }
    }
    return whiteMoves;
  };

  genereteArMoveBlack = (blackPownAndPosition, blackPosition, whitePosition) => {
    const blackMoves = [];

    for (const onePos of blackPownAndPosition) {
      // position
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

      // white Pown
      // if places ahed dont have black pown
      if (onePos[1] === 'bP') {
        if (!blackPosition.includes(`${back}`) && vertical > 1 && vertical < 8 && !whitePosition.includes(`${back}`)) {
          blackMoves.push([place, back]);
        }

        if (inlineRight && whitePosition.includes(`${backRight}`) && !blackPosition.includes(`${backRight}`)) {
          blackMoves.push([place, backRight]);
        }

        if (inlineLeft && whitePosition.includes(`${backLeft}`) && !blackPosition.includes(`${backLeft}`)) {
          blackMoves.push([place, backLeft]);
        }
      }
      // for side on Queen and king
      if (onePos[1] === 'bQ' || onePos[1] === 'bK') {
        // front
        if (vertical < 8 && !blackPosition.includes(`${front}`)) {
          blackMoves.push([place, front]);
        }
        // back
        if (vertical > 1 && !blackPosition.includes(`${back}`)) {
          blackMoves.push([place, back]);
        }
        // right
        if (inlineRight && !blackPosition.includes(`${right}`)) {
          blackMoves.push([place, right]);
        }
        // left
        if (inlineLeft && !blackPosition.includes(`${left}`)) {
          blackMoves.push([place, left]);
        }
      }
      // for side for queen(cross)
      if (onePos[1] === 'bQ') {
        // Front Right
        if (vertical < 8 && inlineRight && !blackPosition.includes(`${frontRight}`)) {
          blackMoves.push([place, frontRight]);
        }
        // front Left
        if (vertical < 8 && inlineRight && !blackPosition.includes(`${frontLeft}`)) {
          blackMoves.push([place, frontLeft]);
        }
        // back Right
        if (vertical > 1 && inlineRight && !blackPosition.includes(`${backRight}`)) {
          blackMoves.push([place, backRight]);
        }
        // back left
        if (vertical > 1 && inlineRight && !blackPosition.includes(`${backLeft}`)) {
          blackMoves.push([place, backLeft]);
        }
      }
    }
    return blackMoves;
  };

  posibleMove = async () => {
    const allPositionArr2D = Object.entries(this.board.position());
    const blackPosition = [];
    const whitePosition = [];

    // sortowanie pół na te z czarnymi pionkami
    const blackPownAndPosition = allPositionArr2D.filter((el) => {
      if (el[1] === 'bP' || el[1] === 'bQ' || el[1] === 'bK') {
        blackPosition.push(el[0]);
        return el;
      }
    });
    const whitePownAndPosition = allPositionArr2D.filter((el) => {
      if (el[1] === 'wP' || el[1] === 'wQ' || el[1] === 'wK') {
        whitePosition.push(el[0]);
        return el;
      }
    });
    const whiteMoves = this.genereteArrForWait(whitePownAndPosition, whitePosition, blackPosition);
    const blackMoves = this.genereteArMoveBlack(blackPownAndPosition,blackPosition,whitePosition)
    console.log(blackMoves);
  };

  onDrop = (source, target, piece, newPos, oldPos) => {
    this.posibleMove();
    if (piece[0])

    // Zakaz zbijania swoich pionków
    {
      if (oldPos[target]) {
        if (oldPos[target][0] === piece[0]) {
          return 'snapback';
        }
        if (oldPos[target][0] !== piece[0] && piece[1] === 'P') {
          const checkAttac = this.pawn.attackShema(source, target, piece, this);
          return checkAttac ? this.levelUpPawn(target, piece) : 'snapback';
        }
      }
    }
    if (piece[1] === 'P') {
      const checkMove = this.pawn.moveShema(source, target, piece, this);

      return checkMove ? this.levelUpPawn(target, piece) : 'snapback';
    }

    if (piece[1] === 'Q') {
      const checkMove = this.queen.moveAndAttackShema(source, target, piece, this);
      return checkMove || 'snapback';
    }
    if (piece[1] === 'K') {
      const checkMove = this.king.moveAndAttackShema(source, target, piece, this);
      return checkMove || 'snapback';
    }
  };

  fight = () => {
    const ar = [
      null,
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
    ];

    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // const ranfom = `${ar[getRandomIntInclusive(1, 8)]}${getRandomIntInclusive(1, 9)}-${ar[getRandomIntInclusive(1, 8)]}${getRandomIntInclusive(1, 8)}`;

    // this.board.move(ranfom);
  };
}
