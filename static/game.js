// z let udelat const, kde to jde

// Definitions
let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");
let width = 576;
let height = 576;
let tile = 32;

let speed = 5;
let friction = 0.9;

let events = [];

let keys = [];
let keyPressed = "";

canvas.width = width;
canvas.height = height;

ctx.globalAlpha = 1;
ctx.fillStyle = "#ffffff";
ctx.textAlign = "center";
ctx.font = '10px "Press Start 2P"';

let game = {
    hud: document.querySelector("#hud"),
    scoreHud: document.querySelector("#totalScore"),
    streakHud: document.querySelector("#maxStreak"),
    lifeHud: document.querySelector("#lifeCount"),
    timeHud: document.querySelector("#time"),
    eventLog: document.querySelector("#eventLog"),
    eventLogSize: 5,
    running: false,
    totalScore: 0,
    streakScore: 0,
    streakSwitch: false,
    maxStreak: 0,
    timeStart: 0,
    timeElapsed: 0,
    difficultySwitch: false
}

// Create event log table
for (let i = 0; i < game.eventLogSize; i++) {
    game.eventLog.insertRow(i).insertCell();
}

// Event log messages
// Start game
let startMsg = [
    "Alright, here we go!",
    "Starting the game. Have fun!",
    "Starting the game. Good luck!",
    "And the game is on!",
    "Good luck my friend!",
    "And here we go!"
];

// Hit
let shockMsg = [
    "Oh no! ",
    "Oh damn! ",
    "Noooooo! ",
    "Uh-oh! ",
    "Whoops! ",
    "Ouch! ",
    "Whyyy?! "
];

let hitMsg = [
    "You got hit!",
    "What a hit!",
    "These demons are the worst!",
    "That demon got you.",
    "That stupid demon got you.",
    "Stupid demon!",
    "You got hit by a demon.",
    "It's a hit!",
    "A hit!",
    "This hit surely wasn't your fault."
];

let resetMsg = [
    "Please, be careful! ",
    "Be careful! ",
    "Careful! "
];

let livesMsg = [
    "You now have {0} left.",
    "Only {0} remaining.",
    "You have {0} left."
];

// Streaks
let streakFirstTier = [
    "Good job! ",
    "Nice! ",
    "Great job! ",
    "Awesome! ",
    "Amazing! ",
    "Wow! ",
    "Cool! "
];

let streakSecondTier = [
    "HOLY COW! ",
    "YOU RULE! ",
    "WHAAAT?! ",
    "EPIC! "
];

let streakMsg = [
    "You've just scored {0} points in one streak.",
    "Your last streak was {0} points.",
    "You have scored {0} points in your last streak.",
    "You have scored {0} in single streak."
];

// Difficulty
let speedUpMsg = [
    "You're doing fine. Let's speed things up a bit.",
    "These demons are getting angrier. And faster.",
    "Watch out! Demons are getting faster.",
];

let newRockAlertMsg = [
    "Stay away from the door! I hear another demon coming in.",
    "I can hear another demon creeping through the door.",
    "Watch out! Another demon is coming through the door.",
];

let newRockAddMsg = [
    "And the demon is here!",
    "Whoa! That demon really got through.",
    "More demons, more fun, right?"
];

// Death
let deathMsg = [
    "You have died!",
    "GAME OVER.",
    "That's it. You are dead.",
    "You are dead.",
    "The game is over. What a shame.",
    "The game is over."
];

// Images and animation
let ghostImg = new Image();
ghostImg.src = "/static/graphics/ghost.png";

let diamondImg = new Image();
diamondImg.src = "/static/graphics/diamond_blue.png";

let diamondColImg = new Image();
diamondColImg.src = "/static/graphics/diamond_yellow.png";

let rockImg = new Image();
rockImg.src = "/static/graphics/enemy.png";

let torchFrontImg = new Image();
torchFrontImg.src = "/static/graphics/torch_front.png";

let torchLeftImg = new Image();
torchLeftImg.src = "/static/graphics/torch_left.png";

let torchRightImg = new Image();
torchRightImg.src = "/static/graphics/torch_right.png";

let iconsImg = new Image();
iconsImg.src = "/static/graphics/icons.png";

let animation = {
    totalFrames: 4,
    counterTotal: 10,
    counterCurrent: 1,
    shiftX: 0,
}

// Create torches coordinates for animation purposes
let torchesFront = [
    [224, 0],
    [320, 0]
];

let torchesLeft = [
    [32, 96],
    [32, 448],
];

let torchesRight = [
    [512, 96],
    [512, 448]
];


// Create player
let player = {
    width: 24,
    height: 32,
    x: (width - tile) / 2,
    y: tile * 2,
    speed: speed,
    velX: 0,
    velY: 0,
    shiftY: 0,
    lives: 3,
    hit: false,
    name: "",
    scoreSent: false
}

// Create npcs
class Npc {
    constructor() {
        this.width = 22;
        this.height = 26;
        this.x = 0;
        this.y = 0;
        this.speed = 3.5;
        this.dirX = 0;
        this.dirY = 0;
        this.velX = 0;
        this.velY = 0;
        this.hit = false;
    }
}

// Create diamond
let diamond = new Npc();

// Create enemy
let enemy = [];

function resetDiamond() {
    diamond.width = 30;
    diamond.height = 28;
    diamond.x = width * 0.5;
    diamond.y = height * 0.5;
    setDirection(diamond);
}

function resetEnemy() {
    enemy = [];

    enemy.push(new Npc());
    enemy[0].x = width * 0.25;
    enemy[0].y = height * 0.75;
    setDirection(enemy[0]);

    enemy.push(new Npc());
    enemy[1].x = width * 0.75;
    enemy[1].y = height * 0.75;
    setDirection(enemy[1]);
}

// Set npc's direction
function setDirection(obj) {
    let angle = Math.random() * (2 * Math.PI);
    obj.dirX = Math.cos(angle);
    obj.dirY = Math.sin(angle);

    obj.velX = obj.dirX * obj.speed;
    obj.velY = obj.dirY * obj.speed;
}

// Starting screen
function intro() {

    ctx.clearRect(0, 0, width, height);

    ctx.fillText("Press SPACE to start the game.", width / 2, height / 2 - tile);
    ctx.drawImage(diamondImg, 0, 0, tile, tile, width / 2 - tile, height / 2, tile, tile);
    ctx.drawImage(iconsImg, 0, 0, tile, tile, width / 2, height / 2, tile, tile);
    ctx.drawImage(rockImg, 0, 0, tile, tile, width / 2 - tile + 2, height / 2 + tile, tile, tile);
    ctx.drawImage(iconsImg, tile, 0, tile, tile, width / 2, height / 2 + tile, tile, tile);

    drawBackground(torchFrontImg, torchesFront);
    drawBackground(torchLeftImg, torchesLeft);
    drawBackground(torchRightImg, torchesRight);

    if (keys[32]) {
        startGame();
    } else {
        requestAnimationFrame(intro);
    }
}

// Start game after space is clicked
function startGame() {
    resetGame();
    resetPlayer();
    resetDiamond();
    resetEnemy();

    game.running = true;
    game.timeStart = Date.now();

    events.unshift(randomMsg(startMsg));

    update();
}

// Reset game
function resetGame() {
    player.lives = 3;
    player.scoreSent = false;

    game.streakScore = 0;
    game.totalScore = 0;
    game.maxStreak = 0;
}

// Reset player
function resetPlayer() {
    player.x = (width - tile) / 2;
    player.y = tile * 2;
    player.velX = 0;
    player.velY = 0;

    player.hit = false;
}

// Death screen
function death() {

    ctx.clearRect(0, 0, width, height);

    ctx.fillText("GAME OVER!", width / 2, height / 2 - tile * 2);
    ctx.fillText("Score: " + game.totalScore, width / 2, height / 2 - tile);
    ctx.fillText("Type in your name and", width / 2, height / 2);
    ctx.fillText("press ENTER to submit your score:", width / 2, height / 2 + tile * 0.5);

    namePlayer();
    ctx.fillText(player.name, width / 2, height / 2 + tile * 1.5);

    ctx.fillText("or press SPACE to try again.", width / 2, height / 2 + tile * 3);

    drawBackground(torchFrontImg, torchesFront);
    drawBackground(torchLeftImg, torchesLeft);
    drawBackground(torchRightImg, torchesRight);

    game.running = false;

    drawEventLog();

    if (keys[32]) {
        startGame();
    } else if (keys[13] && player.name && player.scoreSent === false) {
        submitHighScore();
        requestAnimationFrame(death);
    } else {
        requestAnimationFrame(death);
    }
}

// High score submit
function namePlayer() {
    document.onkeydown = function(e) {
        if (keyPressed === "Backspace") {
            player.name = player.name.slice(0, -1);
        } else {
            if (player.name.length < 9 && (
                    e.keyCode >= 48 && e.keyCode <= 57 ||
                    e.keyCode >= 45 && e.keyCode <= 90
                )) {
                player.name += keyPressed;
                player.name = player.name.replace(/[^a-z0-9]+$/gi, "");
            }
        }
    };
}

function submitHighScore() {
    xreq = new XMLHttpRequest();

    xreq.open("POST", "/", true);
    xreq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xreq.onload = function() {
        if (xreq.status === 200) {
            events.unshift("Your high score has been submitted.")
        } else {
            events.unshift("Error submitting high score. Sorry.")
            player.scoreSent = false;
        }
    }

    xreq.send("name=" + player.name + "&score=" + game.totalScore + "&streak=" + game.maxStreak + "&time=" + formatTime());

    events.unshift("Submitting your high score...");
    player.scoreSent = true;
}

// Update when game is running - aka the game itself
function update() {
    ctx.clearRect(0, 0, width, height);

    drawBackground(torchFrontImg, torchesFront);
    drawBackground(torchLeftImg, torchesLeft);
    drawBackground(torchRightImg, torchesRight);

    if (game.running) {

        if (player.lives < 1) {
            death();
            return;
        }

        // Diamond
        npcMovement(diamond);
        drawObject(diamondImg, diamond);

        // Player
        if (player.hit) {
            if ((keys[37] || keys[38] || keys[39] || keys[40]) && !playerColRock()) {
                resetPlayer();
                logReset();
            }
            ctx.globalAlpha = 0.5;
            ctx.drawImage(ghostImg, 0, 0, tile, tile, (width - tile) / 2, tile * 2, tile, tile);
            ctx.globalAlpha = 1;


        } else {
            playerMovement();

            playerColRock();
            playerColDiamond();

            drawObject(ghostImg, player, player.shiftY);
        }

        // Enemy
        for (let i = 0; i < enemy.length; i++) {

            npcMovement(enemy[i]);

            if (!objectColCheck(enemy[i], diamond)) {
                if (enemy[i].hit === true && diamond.hit === true) {
                    setDirection(diamond);
                    enemy[i].hit = false;
                    diamond.hit = false;
                }
            } else {
                enemy[i].hit = true;
                diamond.hit = true;
            }

            if (enemy[i].velX > 0) {
                drawObject(rockImg, enemy[i], 0);
            } else {
                drawObject(rockImg, enemy[i], 32);
            }
        }

        updateTime();

        raiseDifficulty()

        drawHud();
        drawEventLog();

        animate();

        requestAnimationFrame(update);
    }
}

// Make it harder
function raiseDifficulty() {
    if (game.timeElapsed >= 1) {
        // Every xx:00 add new demon
        if (game.timeElapsed % 60 === 0) {
            if (game.difficultySwitch === false) {
                enemy.push(new Npc());
                enemy[enemy.length - 1].x = width * 0.50;
                enemy[enemy.length - 1].y = tile;
                setDirection(enemy[enemy.length - 1]);

                events.unshift(randomMsg(newRockAddMsg));
                game.difficultySwitch = true;
            }

            // Every xx:55 alert player new demon is coming
        } else if (game.timeElapsed % 60 === 55) {
            if (game.difficultySwitch === false) {
                events.unshift(randomMsg(newRockAlertMsg));
                game.difficultySwitch = true;
            }

            // Every xx:30 make active demons faster
        } else if (game.timeElapsed % 60 === 30) {
            if (game.difficultySwitch === false) {
                for (let i = 1; i < enemy.length; i++) {
                    enemy[i].velX *= 1.2;
                    enemy[i].velY *= 1.2;
                }
                events.unshift(randomMsg(speedUpMsg));
                game.difficultySwitch = true;
            }
        } else {
            game.difficultySwitch = false;
        }
    }
}

// Border collision
function borderColCheck(obj) {
    if (obj.x < tile) {
        obj.velX *= -1;
        obj.x = tile;
    } else if (obj.x + obj.width > width - tile) {
        obj.velX *= -1;
        obj.x = width - tile - obj.width;
    } else if (obj.y < tile / 2) {
        obj.velY *= -1;
        obj.y = tile / 2;
    } else if (obj.y + obj.height > height - tile) {
        obj.velY *= -1;
        obj.y = height - tile - obj.height;
    } else {
        return null;
    }
}

// Object's collision with another object
function objectColCheck(obj, obj2) {
    if (
        obj.x + obj.width < obj2.x ||
        obj2.x + obj2.width < obj.x ||
        obj.y + obj.height < obj2.y ||
        obj2.y + obj2.height < obj.y
    ) {
        return false;
    } else {
        return true;
    }
}

// Player's collisions
function playerColDiamond() {
    if (objectColCheck(player, diamond)) {
        game.streakScore++;
        game.totalScore++;
        game.streakSwitch = true;

        ctx.globalAlpha = 0.5;
        drawObject(diamondColImg, diamond);
        ctx.globalAlpha = 1;


        if (!(keys[37] || keys[38] || keys[39] || keys[40])) {
            player.shiftY = 0;
            player.velX = diamond.velX;
            player.velY = diamond.velY;
        }
    } else {
        if (game.streakSwitch === true) {
            game.streakSwitch = false;
            logScoreStreak();
        }
        game.streakScore = 0;
    }

    if (game.streakScore > game.maxStreak) {
        game.maxStreak = game.streakScore;
    }
}

function playerColRock() {
    for (let i = 0; i < enemy.length; i++) {
        if (objectColCheck(player, enemy[i])) {
            if (player.hit === false) {
                player.lives--;
                player.hit = true;
                logHit();
            }
            return true;
        }
    }
    return false;
}

// Player movement
function playerMovement() {

    if (keys[39]) {
        if (player.velX < player.speed) {
            player.velX++;
        }
        player.shiftY = 64;
    }

    if (keys[37]) {
        if (player.velX > -player.speed) {
            player.velX--;
        }
        player.shiftY = 32;
    }

    if (keys[40]) {
        if (player.velY < player.speed) {
            player.velY++;
        }
        player.shiftY = 0;
    }

    if (keys[38]) {
        if (player.velY > -player.speed) {
            player.velY--;
        }
        player.shiftY = 96;
    }

    borderColCheck(player);

    player.velX *= friction;
    player.velY *= friction;

    player.x += player.velX;
    player.y += player.velY;
}

// Npc movement
function npcMovement(obj) {
    borderColCheck(obj);
    obj.x += obj.velX;
    obj.y += obj.velY;
}

function drawObject(img, obj, shiftY = 0) {
    ctx.drawImage(img, animation.shiftX, shiftY, tile, tile, obj.x, obj.y, tile, tile);
}

function drawPlayer() {
    ctx.drawImage(ghostImg, animation.shiftX, player.shiftY, tile, tile, player.x, player.y, tile, tile);
}

function drawEnemy(obj) {
    if (obj.velX > 0) {
        ctx.drawImage(rockImg, animation.shiftX, 0, tile, tile, obj.x, obj.y, tile, tile);
    } else {
        ctx.drawImage(rockImg, animation.shiftX, 32, tile, tile, obj.x, obj.y, tile, tile);
    }
}

function drawBackground(img, array) {
    for (let i = 0; i < array.length; i++) {
        ctx.drawImage(img, animation.shiftX, 0, tile, tile, array[i][0], array[i][1], tile, tile);
    }
}

function animate() {
    if (animation.counterCurrent === animation.counterTotal) {
        animation.shiftX += tile;
        animation.counterCurrent = 1;
    }
    if (animation.shiftX === tile * animation.totalFrames) {
        animation.shiftX = 0;
    }
    animation.counterCurrent++;
}

// HUD
function drawHud() {
    game.scoreHud.textContent = `Score: ${game.totalScore}`;
    game.streakHud.textContent = `Max. streak: ${game.maxStreak}`;
    game.lifeHud.textContent = `Lives: ${player.lives}`;
}

function updateTime() {
    game.timeElapsed = Math.floor((Date.now() - game.timeStart) / 1000);

    game.timeHud.textContent = `Time: ${formatTime()}`;
}

function formatTime() {
    let minutes = Math.floor(game.timeElapsed / 60);
    return ("00" + minutes).slice(-2) + ":" + ("00" + (game.timeElapsed - minutes * 60)).slice(-2);
}

// Event log
function drawEventLog() {
    while (events.length > game.eventLogSize) {
        events.pop();
    }
    for (let i = 0; i < events.length; i++) {
        game.eventLog.rows[i].textContent = events[i];

        if (i === game.eventLogSize - 2) {
            game.eventLog.rows[i].style.color = "rgba(255, 255, 255, 0.40)";
        } else if (i === game.eventLogSize - 1) {
            game.eventLog.rows[i].style.color = "rgba(255, 255, 255, 0.15)";
        }
    }
}

function logScoreStreak() {
    if (game.streakScore >= 400) {
        events.unshift(randomMsg(streakSecondTier) + randomMsg(streakMsg).replace("{0}", game.streakScore));
    } else if (game.streakScore >= 150) {
        events.unshift(randomMsg(streakFirstTier) + randomMsg(streakMsg).replace("{0}", game.streakScore));
    }
}

function logHit() {
    if (player.lives === 0) {
        events.unshift(randomMsg(shockMsg) + randomMsg(deathMsg));
    } else {
        events.unshift(randomMsg(shockMsg) + randomMsg(hitMsg));
    }
}

function logReset() {
    if (player.lives === 1) {
        events.unshift(randomMsg(resetMsg) + randomMsg(livesMsg).replace("{0}", player.lives + " life"));
    } else {
        events.unshift(randomMsg(resetMsg) + randomMsg(livesMsg).replace("{0}", player.lives + " lives"));
    }

}

function randomMsg(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Event listeners
document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
    keyPressed = e.key;
    e.preventDefault();
});

document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
    keyPressed = "";
});

// Initialize after load
window.addEventListener("load", intro);