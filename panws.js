const inlineConverter = (sign) => {
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
      return false;
  }
};
const checkTurn = (color, gameObj) => {
  const moveEvent = new Event('move');
  document.dispatchEvent(moveEvent);
  if (color[0] === 'b' && gameObj.turn) {
    return false;
  } if (color[0] === 'w' && !gameObj.turn) {
    return false;
  }
  return true;
};

class NewPawn {
  move(position, color) {
    const side = (color === 'wP') ? 1 : -1;
    const vertical = Number(position[1]);
    const legalMov = [];
    legalMov.push(`${position[0]}${vertical + side}`);
    console.log(legalMov);
    return legalMov;
  }

  atack(position, color) {
    const side = (color === 'wP') ? 1 : -1;
    const vertical = Number(position[1]);
    const inline = inlineConverter(position[0]);
    const legalMov = [];


  }
}

const x = new NewPawn();
x.move('e7', 'wP');

export class Pawns {
  moveShema = (source, target, color, gameObj) => {
    const actualVertical = Number(source[1]);
    const actualInline = source[0];
    const newVertical = Number(target[1]);
    const newInline = target[0];
    const side = (color === 'wP') ? 1 : -1;
    const turn = checkTurn(color, gameObj);

    if (target === 'offboard') {
      return false;
    }
    if (!turn) {
      return false;
    }

    if (actualVertical + side === newVertical && actualInline === newInline && turn) {
      gameObj.turn = !gameObj.turn;
      const black = new Event('black');
      if (!gameObj.turn) {
        document.dispatchEvent(black);
      }
      return true;
    }
    return false;
  };

  attackShema(source, target, color, gameObj) {
    const actualVertical = Number(source[1]);
    const actualInline = inlineConverter(source[0]);
    const newVertical = Number(target[1]);
    const newInline = inlineConverter(target[0]);
    const side = (color === 'wP') ? 1 : -1;
    const turn = checkTurn(color, gameObj);
    if (target === 'offboard') {
      return false;
    }

    if (!turn) {
      return false;
    }

    if (actualVertical + side === newVertical) {
      if (actualInline + 1 === newInline || actualInline - 1 === newInline) {
        gameObj.turn = !gameObj.turn;
        return true;
      }
    }
    return false;
  }
}

export class Queen {
  moveAndAttackShema(source, target, color, gameObj) {
    const actualVertical = Number(source[1]);
    const actualInline = inlineConverter(source[0]);
    const newVertical = Number(target[1]);
    const newInline = inlineConverter(target[0]);

    const inlineMove = newInline - actualInline;
    const verticalMove = newVertical - actualVertical;
    const turn = checkTurn(color, gameObj);

    if (target === 'offboard') {
      return false;
    }
    // check turn
    if (!turn) {
      return false;
    }

    if (inlineMove <= 1 && inlineMove >= -1 && verticalMove <= 1 && verticalMove >= -1) {
      gameObj.turn = !gameObj.turn;
      return true;
    }
    return false;
  }
}

export class King {
  moveAndAttackShema(source, target, color, gameObj) {
    const actualVertical = Number(source[1]);
    const actualInline = inlineConverter(source[0]);
    const newVertical = Number(target[1]);
    const newInline = inlineConverter(target[0]);
    const inlineMove = newInline - actualInline;
    const verticalMove = newVertical - actualVertical;
    const turn = checkTurn(color, gameObj);

    if (target === 'offboard') {
      return false;
    }
    // check turn
    if (!turn) {
      return false;
    }

    if (inlineMove <= 1 && inlineMove >= -1 && verticalMove === 0) {
      gameObj.turn = !gameObj.turn;
      return true;
    } if (inlineMove === 0 && verticalMove <= 1 && verticalMove >= -1) {
      gameObj.turn = !gameObj.turn;
      return true;
    }

    return false;
  }
}
