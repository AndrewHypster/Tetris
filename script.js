const game = document.querySelector('.game'),
      pointsElem = document.getElementById('points'),
      levelElem = document.getElementById('level'),
      nextTetroElem = document.getElementById('nextTetro'),
      pauseBtn = document.getElementById('pause'),
      startBtn = document.getElementById('start'),
      leftBtn = document.getElementById('left'),
      rightBtn = document.getElementById('right'),
      roundArrow = document.getElementById('round-arrow');

let field = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 2, 2, 2, 0, 0],
    [0, 0, 0, 1, 0, 0, 2, 0, 0, 0],
    [0, 1, 1, 1, 0, 0, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 0, 2, 2, 2, 0],
    [0, 1, 0, 0, 1, 0, 2, 0, 2, 0],
    [0, 1, 0, 0, 1, 0, 2, 2, 2, 0],
    [0, 0, 0, 0, 0, 0, 2, 2, 0, 0],
    [0, 0, 1, 1, 1, 0, 2, 0, 2, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let points = 0,
    level = 1;

levelElem.innerHTML = level;

let possibleLevels = {
    1: {
        pointsPerLine: 10,
        speed: 400,
        nextLevel: 5,
    },
    2: {
        pointsPerLine: 15,
        speed: 380,
        nextLevel: 1000,
    },
    3: {
        pointsPerLine: 20,
        speed: 360,
        nextLevel: 1500,
    },
    4: {
        pointsPerLine: 25,
        speed: 340,
        nextLevel: 2000,
    },
    5: {
        pointsPerLine: 30,
        speed: 320,
        nextLevel: Infinity,
    }
}

let figures = {
    O: [
        [1, 1],
        [1, 1]
    ],
    I: [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
    ],
    S: [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0]
    ],
    Z: [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1]
    ],
    L: [
        [1, 0, 0],
        [1, 0, 0],
        [1, 1, 0]
    ],
    J: [
        [0, 0, 1],
        [0, 0, 1],
        [0, 1, 1]
    ],
    T: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ]
}

let activeTetro = getNewTetro(),
    nextTetro = getNewTetro(),
    isPaused = true,
    timerID;

function remoweActiveTetro() {
    for (let y = 0; y < field.length; y++){
        for (let x = 0; x < field[y].length; x++){
            if (field[y][x] === 1) {
                field[y][x] = 0;
            }
        }
    }
}

function addActiveTetro() {
    remoweActiveTetro();
    for (let y = 0; y < activeTetro.shape.length; y++){
        for (let x = 0; x < activeTetro.shape[y].length; x++){
            if (activeTetro.shape[y][x]) {
                field[activeTetro.y+y][activeTetro.x+x] = activeTetro.shape[y][x];
            }
        }
    }
}

function rotateTetro() {
    const tetroState = activeTetro.shape;
    activeTetro.shape = activeTetro.shape[0].map((val, index) =>
        activeTetro.shape.map(row => row[index]).reverse()
    );
    if (hasCollisions()) {
        activeTetro.shape = tetroState;
    }
}

function hasCollisions() {
    for (let y = 0; y < activeTetro.shape.length; y++){
        for (let x = 0; x < activeTetro.shape[y].length; x++){
            if (activeTetro.shape[y][x] &&  //якщо це одиниця (рухомий блок)
                (field[activeTetro.y+y] == undefined ||    //коли дем в низ
                field[activeTetro.y+y][activeTetro.x+x] == undefined ||    //йдем в бік
                field[activeTetro.y+y][activeTetro.x+x] == 2)    //зустрічаємося з фіксованими
                ) {
                return true;
            }
        }
    }
    return false;
}

function draw () {
    let innerHTML = '';
    for (let y = 0; y < field.length; y++){
        for (let x = 0; x < field[y].length; x++){
            if (field[y][x] == 1)
                innerHTML += '<div class="cell movingCell"></div>';
            else if (field[y][x] == 2)
                innerHTML += '<div class="cell fixetCell"></div>';
            else
                innerHTML += '<div class="cell"></div>';
        }
        innerHTML += '<br/>'
    }
    game.innerHTML = innerHTML;
}

function drawNextTetro() {
    let nextTetroInnerHTML = '';
    for (let y = 0; y < nextTetro.shape.length; y++) {
        for (let x = 0; x < nextTetro.shape[y].length; x++) {
            if (nextTetro.shape[y][x])
                nextTetroInnerHTML += '<div class="cell movingCell"></div>';
            else
                nextTetroInnerHTML += '<div class="cell"></div>';
        }
        nextTetroInnerHTML += '<br/>';
    }
    nextTetroElem.innerHTML = nextTetroInnerHTML;
}

function checkFullLines(){
    let canRemove = true,
        filletLines = 0;
    for (let y = 0; y < field.length; y++){
        for (let x = 0; x < field[y].length; x++){
            if (field[y][x] != 2)
            canRemove = false;
        }
        if (canRemove) {
            field.splice(y, 1);
            field.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            filletLines ++;
        }
        canRemove = true;
    }
    switch (filletLines) {
        case 1:
            points += possibleLevels[level].pointsPerLine;
            break;
        case 2:
            points += possibleLevels[level].pointsPerLine * 3;
            break;
        case 3:
            points += possibleLevels[level].pointsPerLine * 6;
            break;
        case 4:
            points += possibleLevels[level].pointsPerLine * 12;
            break;
        case 5:
            points += possibleLevels[level].pointsPerLine * 24;
            break;
    }
    pointsElem.innerHTML = points;
    if (points >= possibleLevels[level].nextLevel){
        level++;
        levelElem.innerHTML = level;
    }
}

function getNewTetro() {
    const possibleFigures = 'OISZLJT';
    const rand = Math.floor(Math.random()*7);
    const newTetro = figures[possibleFigures[rand]];
    return {
        x: Math.floor((field[0].length - newTetro[0].length)/2),
        y: 0,
        shape: newTetro,
    }
}

function fixTetro (){
    for (let y = 0; y < field.length; y++){
        for (let x = 0; x < field[y].length; x++){
            if (field[y][x] == 1) 
                field[y][x] = 2;
        }
    }
}

function moveTetroDown (){
    activeTetro.y += 1;
    if (hasCollisions()) {
        activeTetro.y -= 1;
        fixTetro ();
        checkFullLines();
        activeTetro = nextTetro;
        if (hasCollisions()) {
            reset();
        }
        nextTetro = getNewTetro();
    }   
}

function dropTetro() {
    for (let y = activeTetro.y; y < field.length; y++) {
        activeTetro.y ++;
        if (hasCollisions()) {
            activeTetro.y --;
            break;
        }
    }
}

function reset() {
    isPaused = true;
    clearTimeout(timerID);
    setTimeout(() => {
        field = [                           //GAME
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 2, 0, 0, 0],
        [0, 0, 0, 2, 2, 2, 2, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 2, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 2, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 1, 1, 0, 1, 1, 0, 0, 0],
        [0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 2, 2, 2, 0, 0, 0],
        [0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 2, 2, 2, 0, 0, 0],
        [0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 2, 2, 2, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        draw();
        setTimeout(() => {
            field = [                           //OVER
                [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
                [0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
                [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 2, 0, 2, 0, 0, 0, 0],
                [0, 0, 0, 2, 0, 2, 0, 0, 0, 0],
                [0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
                [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
                [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 2, 2, 2, 0, 0, 0, 0],
                [0, 0, 0, 2, 0, 2, 0, 0, 0, 0],
                [0, 0, 0, 2, 2, 2, 0, 0, 0, 0],
                [0, 0, 0, 2, 2, 0, 0, 0, 0, 0],
                [0, 0, 0, 2, 0, 2, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ];
            draw();
            setTimeout(() => {
                points = 0;
                level = 1;
                pointsElem.innerHTML = points;
                levelElem.innerHTML = level;
                field = [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                ];
                startBtn.innerHTML = 'Restart'
                isPaused = false;
                timerID = setTimeout(startDraw, possibleLevels[level].speed);
                draw();
            }, 3000);
        }, 3000);
    }, 3000);
}

leftBtn.addEventListener('click', () => {
    if (!isPaused) {
        activeTetro.x -= 1;
        if (hasCollisions()) {
            activeTetro.x += 1;
        }
    }
    updateGameState();
});

rightBtn.addEventListener('click', () => {
    if (!isPaused) {
        activeTetro.x += 1;
        if (hasCollisions()) {
            activeTetro.x -= 1;
        }
    }
    updateGameState();
});

roundArrow.addEventListener('click', () => {
    if (!isPaused) rotateTetro()
    updateGameState();
});

document.onkeydown = function (e){
        if (e.keyCode == 37){           //Left
            if (!isPaused) {
                activeTetro.x -= 1;
                if (hasCollisions()) {
                    activeTetro.x += 1;
                }
            }
        }else if (e.keyCode == 39){     //Right
            if (!isPaused) {
                activeTetro.x += 1;
                if (hasCollisions()) {
                    activeTetro.x -= 1;
                }
            }
        }else if (e.keyCode == 40){     //Down
            if (!isPaused)
                moveTetroDown();
        }else if (e.keyCode == 38){     //Up
            if (!isPaused)
                rotateTetro();
        }else if(e.keyCode == 13){      //Enter
            if (!isPaused)
                dropTetro();
        }else if (e.keyCode == 32) {    //Spase Pause
            if (pauseBtn.innerHTML === 'Pause') {
                clearTimeout(timerID);
                pauseBtn.innerHTML = 'Play';
            } else {
                timerID = setTimeout(startDraw, possibleLevels[level].speed);
                pauseBtn.innerHTML = 'Pause';
            }
            isPaused = !isPaused;
        }
    updateGameState();
}

function updateGameState() {
    if(!isPaused) {
        addActiveTetro();
        draw ();
        drawNextTetro();
    }
}

pauseBtn.addEventListener('click', e => {
    if (e.target.innerHTML === 'Pause') {
        clearTimeout(timerID);
        e.target.innerHTML = 'Play';
    } else {
        timerID = setTimeout(startDraw, possibleLevels[level].speed);
        e.target.innerHTML = 'Pause';
    }
    isPaused = !isPaused;
});

startBtn.addEventListener('click', e => {
    if (e.target.innerHTML == 'Restart') {
        reset();
    }else {
        field = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        e.target.innerHTML = 'Restart'
        isPaused = false;
        timerID = setTimeout(startDraw, possibleLevels[level].speed);
    }
});

draw();

function startDraw (){
    moveTetroDown();
    if(!isPaused) {
        updateGameState();
        timerID = setTimeout(startDraw, possibleLevels[level].speed);
    }
}
