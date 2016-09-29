// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.xinit = x;

    this.speed = speed;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.reset = function() {
    this.x = this.xinit;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.x = 200;
    this.y = 400;

    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
};

// Reset the game when the player collides with a bug or get to the water
Player.prototype.reset = function() {
    this.x = 200;
    this.y = 400;
};

// MANTER FUNÇÃO
Player.prototype.update = function() {};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.moveLeft = function() {
    if (this.x > 0) {
        this.x -= 101;
    }
};

Player.prototype.moveRight = function() {
    if (this.x < 400) {
        this.x += 101;
    }
};

Player.prototype.moveUp = function() {
    if (this.y > 0) {
        this.y -= 83;
    }
    if (this.y < 46) {
        this.reset();
    }
};

Player.prototype.moveDown = function() {
    if (this.y < 400) {
        this.y += 83;
    }
};


Player.prototype.handleInput = function() {
    switch (event.keyCode) {
        case 37: // Left
            this.moveLeft();
            break;

        case 38: // Up
            this.moveUp();
            break;

        case 39: // Right
            this.moveRight();
            break;

        case 40: // Down
            this.moveDown();
            break;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(-100, 200, 250), new Enemy(-200, 50, 500), new Enemy(-1000, 150, 700), new Enemy(-500, 100, 200), new Enemy(-800, 250, 400)];

var player = new Player();

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    if ((this.x >= player.x - 40 && this.x <= player.x + 40) &&
        (this.y >= player.y - 40 && this.y <= player.y + 40)) {
        // collision detected!
        this.reset();
        player.reset();
    }

    if (this.x > 500) {
        this.reset();
    }
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);