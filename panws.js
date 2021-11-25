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

class Pawns {
  constructor(color) {
    this.color = `${color}P`;
  }

  moveShema(source, target) {
    const actualVertical = Number(source[1]);
    const actualInline = source[0];
    const newVertical = Number(target[1]);
    const newInline = target[0];
    const side = (this.color === 'wP') ? 1 : -1;
    if (newVertical > 8 || newVertical <= 0) {
      return false;
    }

    return (actualVertical + side === newVertical && actualInline === newInline);
  }

  attackShema(source, target) {
    const actualVertical = Number(source[1]);
    const actualInline = inlineConverter(source[0]);
    const newVertical = Number(target[1]);
    const newInline = inlineConverter(target[0]);
    const side = (this.color === 'wP') ? 1 : -1;

    if (newVertical > 8 || newVertical <= 0) {
      return false;
    }

    if (actualVertical + side === newVertical) {
      if (actualInline + 1 === newInline || actualInline - 1 === newInline) {
        return true;
      }
    }
    return false;
  }

  levelAp(target) {
    const newVertical = Number(target[1]);
    if (this.color === 'bP' && newVertical === 1) {
      return true;
    }
    if (this.color === 'wP' && newVertical === 8) {
      return true;
    }
    return false;
  }
}

class Queen {
  constructor(color) {
    this.color = `${color}Q`;
  }

  moveAndAttackShema(source, target) {
    const actualVertical = Number(source[1]);
    const actualInline = inlineConverter(source[0]);
    const newVertical = Number(target[1]);
    const newInline = inlineConverter(target[0]);

    const inlineMove = newInline - actualInline;
    const verticalMove = newVertical - actualVertical;

    if (newVertical > 8 || newVertical <= 0) {
      return false;
    }

    if (inlineMove <= 1 && inlineMove >= -1 && verticalMove <= 1 && verticalMove >= -1) {
      return true;
    }
    return false;
  }
}

class King {
  constructor(color) {
    this.color = `${color}K`;
  }

  moveAndAttackShema(source, target) {
    const actualVertical = Number(source[1]);
    const actualInline = inlineConverter(source[0]);
    const newVertical = Number(target[1]);
    const newInline = inlineConverter(target[0]);
    const inlineMove = newInline - actualInline;
    const verticalMove = newVertical - actualVertical;

    if (newVertical > 8 || newVertical <= 0) {
      return false;
    }

    if (inlineMove <= 1 && inlineMove >= -1 && verticalMove === 0) {
      return true;
    } if (inlineMove === 0 && verticalMove <= 1 && verticalMove >= -1) {
      return true;
    }

    return false;
  }
}

const x = new King();
const y = x.moveAndAttackShema('d4', 'd6');
console.log(y);
module.exports = {
  Pawns,
  Queen,
  King,
};
