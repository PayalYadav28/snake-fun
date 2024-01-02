var lastPaintTime=0;
let snake_Speed=4;
let inputDirection={x:0,y:0};
const gameOver=new Audio("./Music/gameover.mp3");
const music=new Audio("./Music/music.mp3");
const foodpower=new Audio("./Music/food.mp3");
const move=new Audio("./Music/move.mp3");
let lastInputDirection=inputDirection;
const expantion_amount=1;
var score=0;
var highscore=0;
const snakeBody=[
    {x:8,y:8}
      
];
let food=getfoodrandomPosition();
const scoreBox=document.getElementById("score");
const hiscoreBox=document.getElementById("highscore");


let hiscore = localStorage.getItem("hiscore");
if(hiscore === null){
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else{
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML =hiscore;
}
const over=document.getElementById("gameover");
function paint(ctime){
    var TimeSeconds = (ctime - lastPaintTime)/1000;
    window.requestAnimationFrame(paint);
    if(TimeSeconds<1/snake_Speed)return;
    lastPaintTime=ctime;

    update();
    draw();
}

window.requestAnimationFrame(paint);

const board=document.querySelector(".board");

function draw(){
    drawSnake();
    drawFood();
}

function update(){
    board.innerHTML="";
    snakeMove();
    snakeEatFood();
}
function drawSnake(){
    snakeBody.forEach((segment,index)=>{
        music.play();
        var snakeElement=document.createElement("div");
        snakeElement.style.gridColumnStart=segment.x;
        snakeElement.style.gridRowStart=segment.y;
        snakeElement.style.transform='rotate(0dge)'
        if(index==0){
            snakeElement.classList.add("head");
            if(inputDirection.x==1){
                snakeElement.style.transform='rotate(-90dge)'
            }else if(inputDirection.x==-1){
                snakeElement.style.transform='rotate(90dge)'
            }else if(inputDirection.y==-1){
                snakeElement.style.transform='rotate(180dge)'
            }else if(inputDirection.y==1){
                snakeElement.style.transform='rotate(0dge)'
                
            }
        }else{
            snakeElement.classList.add("snake");
        }
        board.appendChild(snakeElement);
    })
}
function drawFood(){
    var foodElement=document.createElement("div");
    foodElement.style.gridColumnStart=food.x;
    foodElement.style.gridRowStart=food.y;
    foodElement.classList.add("food");
    board.appendChild(foodElement);
}

function snakeMove(){

    inputDirection= getInputDirection();
    for(i=snakeBody.length-2;i>=0;i--){
        snakeBody[i+1]={...snakeBody[i]}
    }
    snakeBody[0].x+= inputDirection.x;
    snakeBody[0].y+=inputDirection.y;
    checkGameOver();

}

function getInputDirection(){
    window.addEventListener("keydown",e=>{
       
        switch(e.key){
            case 'ArrowUp':
            if(lastInputDirection.y==1)break;
            inputDirection={x:0,y:-1}
            break;
            case 'ArrowDown': 
            if(lastInputDirection.y==-1)break;
            inputDirection={x:0,y:1}
            break;
            case 'ArrowLeft':
            if(lastInputDirection.x==1)break;
            inputDirection={x:-1,y:0}
            break;
            case 'ArrowRight': 
            if(lastInputDirection.x==-1)break;
            inputDirection={x:1,y:0}
            break;
            default: inputDirection={x:0,y:0}
        }
       
    })
    lastInputDirection=inputDirection;
    return inputDirection;
}
function snakeEatFood(){
    if(isEat()){
        music.pause();
        foodpower.play();
        score+=1;
        if(score>hiscoreval){
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML=score;
        hiscoreBox.innerHTML=hiscoreval;
        food=getfoodrandomPosition();
       
        expandSnake();
    }
    music.play();
}
function isEat(){
    return snakeBody[0].x===food.x && snakeBody[0].y===food.y;
        
}
function getfoodrandomPosition(){
    let a,b,mycondition=true;
    while(mycondition){
        a=Math.ceil(Math.random()*16);
        b=Math.ceil(Math.random()*16);
        mycondition=snakeBody.some(segment=>{
           return segment.x===a && segment.y===b;
        })
    }
    return {x:a,y:b};
}
function expandSnake(){
    for(i=0;i<expantion_amount;i++){
        snakeBody.push(snakeBody[snakeBody.length-1]);
    }
}

function checkGameOver(){
    if(snakeOutOfGrid()||snakeIntersection()){
        music.pause();
        gameOver.play();
        over.innerHTML="Game Over";
        setTimeout(function() {
            location.reload();
          }, 500);

        
    }
    
}

function snakeOutOfGrid(){
    return snakeBody[0].x < 0 || snakeBody[0].x > 16 || snakeBody[0].y < 0|| snakeBody[0].y > 16;
}

function snakeIntersection(){
    for(i=1;i<snakeBody.length;i++){
        if(snakeBody[0].x===snakeBody[i].x && snakeBody[0].y===snakeBody[i].y){
            return true;
        }
    }

}