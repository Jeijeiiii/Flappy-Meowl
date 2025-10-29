let gameStarted = false;
let gameOver = false;

const bgm = new Audio('Images/imanewsoul.mp3');
const jumpSound = new Audio('Images/jump.wav');
const scoreSound = new Audio('Images/score.wav');
const hitSound = new Audio('Images/hit.wav');
const hundredpoints = new Audio('Images/omg.wav');
const thousandpoints = new Audio('Images/omgomg.wav');
const gameoversound = new Audio('Images/rip.mp3');
const restartButton = document.getElementById('restartbutton');
bgm.loop = true;
bgm.volume = 0.7;
bgm.currentime = 9; 

jumpSound.volume = 0.4;
hitSound.volume = 0.4;
hundredpoints.volume = 0.4;
thousandpoints.volume = 0.6;

window.addEventListener('keydown', handleKeydown);
window.addEventListener('mousedown', handleMousedown);
window.addEventListener('touchstart', handleTouchstart);

let score = 0;
const scoreDisplay = document.getElementById('score');


const meowl = document.querySelector('.meowl');

let meowlY = 200;
let velocity = 0;
const gravity = 0.85;
const jumpPower = -11;
const initialY = -300;
const groundY = document.documentElement.clientHeight - initialY;

window.addEventListener("resize", () => {
  groundY = document.documentElement.clientHeight - initialY;
});

function update() {
  if (!gameStarted) return;

  velocity += gravity;
  meowlY += velocity;

  if (meowlY > groundY) {
    meowlY = groundY;
    velocity = 0;
  }

  if (meowlY < -50) {
  meowlY = -50;
  velocity = 0; // stops going higher
  }


  let rotation = velocity * 2.4; 
  if (rotation > 45) rotation = 45;   
  if (rotation < -25) rotation = -25; 

  meowl.style.top = meowlY + 'px';
  meowl.style.transform = `rotate(${rotation}deg)`; 

  requestAnimationFrame(collisionDetection);
  requestAnimationFrame(update);

}

function handleKeydown(e) {
  if (e.code !== 'Space') return;
  e.preventDefault();
  if (gameOver) return;
  if (!gameStarted) {
      startGame();
  }
    jumpSound.play();
    velocity = jumpPower;
  }


function startGame() {
  gameStarted = true;
  bgm.play();
  

  
  document.addEventListener("click", () => {
  if (bgm.paused) {
    bgm.play();
  }});
  bgm.currentTime = 5;

  pipeSpawnInterval = setInterval(createPipe, spawnInterval);
  update();
  updatePipes();

}

function handleMousedown() {
  if (gameOver) return;

  if (!gameStarted) startGame();
    velocity = jumpPower;
    jumpSound.play();
  }

function handleTouchstart(e) {
  if (gameOver) return;
  if (!gameStarted) startGame();
    velocity = jumpPower;
    jumpSound.play();
  }

update();


const game = document.querySelector('.game');
const pipesContainer = document.querySelector('.pipes');

let pipes = [];
const pipeGap = 100;
const pipeSpeed = 7;
const spawnInterval = 1100;

function createPipe() {
  const pipeTop = document.createElement('div');
  const pipeBottom = document.createElement('div');
  pipeTop.classList.add('pipe', 'down');
  pipeBottom.classList.add('pipe', 'up');

  const spawnPosition = document.documentElement.clientWidth + 500;
  
  const minHeight = Math.round(document.documentElement.clientHeight * 0.1); 
  const maxHeight = Math.round(document.documentElement.clientHeight * 0.6); 
  const randomHeight = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;
  
  pipeTop.style.bottom = randomHeight + 'px';
  pipeBottom.style.top = (document.documentElement.clientHeight - randomHeight - pipeGap) + 'px';

  pipeTop.style.left = spawnPosition + 'px';
  pipeBottom.style.left = spawnPosition + 'px';

  pipesContainer.appendChild(pipeTop);
  pipesContainer.appendChild(pipeBottom);
  pipes.push({ top: pipeTop, bottom: pipeBottom });
}

function updatePipes() {
  pipes.forEach((pipe, i) => {
    const currentLeft = parseFloat(pipe.top.style.left);
    const newLeft = currentLeft - pipeSpeed;

    pipe.top.style.left = newLeft + 'px';
    pipe.bottom.style.left = newLeft + 'px';

    if (!pipe.passed && newLeft + pipe.top.offsetWidth - 140 < meowl.offsetLeft) {
      pipe.passed = true;
      score+= 10;
      scoreDisplay.textContent = score;
      scoreSound.play();

      if (score % 100 === 0 && score !== 0) {
        hundredpoints.play();
      }
      if (score % 1000 === 0 && score !== 0){
        thousandpoints.play()
      }
    }

    if (newLeft < -600) {
      pipe.top.remove();
      pipe.bottom.remove();
      pipes.splice(i, 1);
    }
  });

  requestAnimationFrame(updatePipes);
}


let pipeSpawnInterval = null;
function collisionDetection() {

  if (gameOver) return;
  const meowlRect = meowl.getBoundingClientRect();
  const hitboxOffset = 75;

  pipes.forEach((pipe) => {
    const pipeTopRect = (pipe.top.getBoundingClientRect());
    const pipeBottomRect = (pipe.bottom.getBoundingClientRect());

  const pipeTopBox = {
    top: pipeTopRect.top + hitboxOffset,
    bottom: pipeTopRect.bottom - hitboxOffset,
    left: pipeTopRect.left + hitboxOffset,
    right: pipeTopRect.right - hitboxOffset
  };
  const pipeBottomBox = {
    top: pipeBottomRect.top + hitboxOffset + 20,
    bottom: pipeBottomRect.bottom - hitboxOffset,
    left: pipeBottomRect.left + hitboxOffset,
    right: pipeBottomRect.right - hitboxOffset - 30
  };

    if (meowlRect.right > pipeTopBox.left &&
        meowlRect.left < pipeTopBox.right &&
        meowlRect.top < pipeTopBox.bottom &&
        meowlRect.bottom > pipeTopBox.top ||
        meowlRect.right > pipeBottomBox.left &&
        meowlRect.left < pipeBottomBox.right &&
        meowlRect.top < pipeBottomBox.bottom &&
        meowlRect.bottom > pipeBottomBox.top) {

      triggerGameOver();
    }  
  });
}

function triggerGameOver() {
  if (gameOver) return;
  gameOver = true;

  hitSound.play();
  bgm.pause();

  setTimeout(() => {
    gameoversound.play();
  }, 500);

  clearInterval(pipeSpawnInterval);
  const background = document.querySelector('.background');
  velocity = 0;
  pipes = [];
  background.style.animationPlayState = 'paused';  
  updatePipes = () => {};

  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('mousedown', handleMousedown);
  window.removeEventListener('touchstart', handleTouchstart);

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space'){
      setTimeout ( () => {
        window.location.reload();
      }, 1200);
    }
  });

  restartButton.style.opacity = "1";
  restartButton.addEventListener('click', () => {
    window.location.reload();
  });
}