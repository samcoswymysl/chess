import Game from './game.js';

const xxx = new Game('Rafał');
document.addEventListener('black' , xxx.fight)
document.addEventListener('move',() => xxx.levelUpPawn())

