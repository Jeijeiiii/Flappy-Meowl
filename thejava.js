const bgm = new Audio('Images/imanewsoul.mp3');
const jumpSound = new Audio('Images/jump.wav');
const scoreSound = new Audio('Images/score.wav');
const hitSound = new Audio('Images/hit.wav');
const gameoversound = new Audio('Images/rip.mp3');
bgm.loop = true;
bgm.volume = 0.5;
bgm.currentime = 9; 
bgm.play();

jumpSound.volume = 0.4;
hitSound.volume = 0.4;

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
  velocity += gravity;
  meowlY += velocity;

  if (meowlY > groundY) {
    meowlY = groundY;
    velocity = 0;
  }

  let rotation = velocity * 2.4; 
  if (rotation > 45) rotation = 45;   
  if (rotation < -25) rotation = -25; 

  meowl.style.top = meowlY + 'px';
  meowl.style.transform = `rotate(${rotation}deg)`; 

  requestAnimationFrame(collisionDetection);
  requestAnimationFrame(update);
}

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    jumpSound.play();
    velocity = jumpPower;
  }
});

window.addEventListener('mousedown', () => {
  velocity = jumpPower;
});

window.addEventListener('touchstart', () => {
  velocity = jumpPower;
});

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

    if (newLeft < -600) {
      pipe.top.remove();
      pipe.bottom.remove();
      pipes.splice(i, 1);
    }
  });

  requestAnimationFrame(updatePipes);
}


let pipeSpawnInterval = setInterval(createPipe, spawnInterval);
updatePipes();


let gameOver = false;
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
    top: pipeBottomRect.top + hitboxOffset + 10,
    bottom: pipeBottomRect.bottom - hitboxOffset,
    left: pipeBottomRect.left + hitboxOffset,
    right: pipeBottomRect.right - hitboxOffset
  };

    if (meowlRect.right > pipeTopBox.left &&
        meowlRect.left < pipeTopBox.right &&
        meowlRect.top < pipeTopBox.bottom &&
        meowlRect.bottom > pipeTopBox.top ||
        meowlRect.right > pipeBottomBox.left &&
        meowlRect.left < pipeBottomBox.right &&
        meowlRect.top < pipeBottomBox.bottom &&
        meowlRect.bottom > pipeBottomBox.top) {
      // Collision detected
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

  const restartButton = document.getElementById('restartbutton');
  restartButton.addEventListener('click', () => {
    window.location.reload();
  });
}