const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const finalScore = document.getElementById("finalScore");
const gameOverBox = document.getElementById("gameOver");

const grid = 20;
const size = canvas.width / grid;

let snake;
let food;
let direction;
let score;
let speed;
let gameLoop;
let paused = false;

let highScore = localStorage.getItem("snakeHighScore") || 0;
highScoreEl.textContent = highScore;

function randomFood() {
    return {
        x: Math.floor(Math.random() * grid),
        y: Math.floor(Math.random() * grid)
    };
}

function init() {

    snake = [
        {x:10, y:10}
    ];

    food = randomFood();

    direction = "RIGHT";

    score = 0;
    speed = 150;

    scoreEl.textContent = score;

    gameOverBox.style.display = "none";

    if(gameLoop) clearInterval(gameLoop);

    gameLoop = setInterval(update, speed);
}

function drawBackground(){

    ctx.fillStyle="#101820";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle="#1b2b36";

    for(let i=0;i<=grid;i++){

        ctx.beginPath();
        ctx.moveTo(i*size,0);
        ctx.lineTo(i*size,canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0,i*size);
        ctx.lineTo(canvas.width,i*size);
        ctx.stroke();
    }

}

function drawSnake(){

    snake.forEach((part,index)=>{

        ctx.fillStyle=index==0?"#00ff99":"#66ff66";

        ctx.fillRect(
            part.x*size+2,
            part.y*size+2,
            size-4,
            size-4
        );

    });

}

function drawFood(){

    ctx.fillStyle="red";

    ctx.beginPath();

    ctx.arc(
        food.x*size+size/2,
        food.y*size+size/2,
        size/3,
        0,
        Math.PI*2
    );

    ctx.fill();

}

function update(){

    if(paused) return;

    let head={...snake[0]};

    if(direction==="LEFT") head.x--;
    if(direction==="RIGHT") head.x++;
    if(direction==="UP") head.y--;
    if(direction==="DOWN") head.y++;

    if(
        head.x<0 ||
        head.y<0 ||
        head.x>=grid ||
        head.y>=grid
    ){
        gameOver();
        return;
    }

    for(let part of snake){

        if(head.x===part.x && head.y===part.y){

            gameOver();
            return;

        }

    }

    snake.unshift(head);

    if(head.x===food.x && head.y===food.y){

        score++;
        scoreEl.textContent=score;

        if(score>highScore){

            highScore=score;
            highScoreEl.textContent=highScore;
            localStorage.setItem("snakeHighScore",highScore);

        }

        food=randomFood();

        if(score%5===0){

            speed=Math.max(60,speed-10);

            clearInterval(gameLoop);

            gameLoop=setInterval(update,speed);

        }

    }else{

        snake.pop();

    }

    drawBackground();
    drawFood();
    drawSnake();

}

function gameOver(){

    clearInterval(gameLoop);

    finalScore.textContent=score;

    gameOverBox.style.display="block";

}

function restartGame(){

    init();

}

// =======================
// KONTROL KEYBOARD
// =======================
document.addEventListener("keydown", (e) => {

    switch(e.key){

        case "ArrowUp":
            if(direction !== "DOWN")
                direction = "UP";
            break;

        case "ArrowDown":
            if(direction !== "UP")
                direction = "DOWN";
            break;

        case "ArrowLeft":
            if(direction !== "RIGHT")
                direction = "LEFT";
            break;

        case "ArrowRight":
            if(direction !== "LEFT")
                direction = "RIGHT";
            break;

        case "p":
        case "P":
            paused = !paused;
            break;

        case "r":
        case "R":
            restartGame();
            break;

    }

});


// =======================
// KONTROL TOMBOL HP
// =======================
document.getElementById("up").onclick = () => {
    if(direction !== "DOWN")
        direction = "UP";
};

document.getElementById("down").onclick = () => {
    if(direction !== "UP")
        direction = "DOWN";
};

document.getElementById("left").onclick = () => {
    if(direction !== "RIGHT")
        direction = "LEFT";
};

document.getElementById("right").onclick = () => {
    if(direction !== "LEFT")
        direction = "RIGHT";
};


// =======================
// MULAI GAME
// =======================
init();