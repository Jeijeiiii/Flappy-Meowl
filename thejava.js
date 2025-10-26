const bgm = new Audio('Images/imanewsoul.mp3');
bgm.loop = true;
bgm.volume = 0.2;
bgm,currentime = 9; 
bgm.play();

const meowl = document.querySelector('.meowl');

let meowlY = 200;
let velocity = 0;
const gravity = 0.25;
const jumpPower = -4.25;
const initialY = 20;
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

  let rotation = velocity * 3; 
  if (rotation > 45) rotation = 45;   
  if (rotation < -25) rotation = -25; 

  meowl.style.top = meowlY + 'px';
  meowl.style.transform = `rotate(${rotation}deg)`; 

  requestAnimationFrame(update);
}

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
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
const pipeGap = 30;
const pipeSpeed = 2.0;
const spawnInterval = 1000;

function createPipe() {
  const pipeTop = document.createElement('div');
  const pipeBottom = document.createElement('div');
  pipeTop.classList.add('pipe', 'down');
  pipeBottom.classList.add('pipe', 'up');

  const spawnPosition = window.innerWidth + 100;
  
  const minHeight = Math.round(document.documentElement.clientHeight * 0.1); 
  const maxHeight = Math.round(document.documentElement.clientHeight * 0.6); 
  const randomHeight = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;
  
  pipeTop.style.height = randomHeight + 'px';
  pipeBottom.style.height = (document.documentElement.clientHeight - randomHeight - pipeGap) + 'px';
  
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

    if (newLeft < -100) {
      pipe.top.remove();
      pipe.bottom.remove();
      pipes.splice(i, 1);
    }
  });

  requestAnimationFrame(updatePipes);
}

setInterval(createPipe, spawnInterval);
updatePipes();

