/** Class representing physical object body for collisions */
class Rigidbody {
  /**
   * Creates a Rigidbody for game objects
   * @param {number} x X coordinate
   * @param {number} y Y coordinate
   * @param {number} width Width of the Rigidbody
   * @param {number} height Height of the Rigidbody
   */
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Checks if current body collides with other Rigidbody
   * @param {Rigidbody} other Other body to check collision with
   * @returns {bool} True if collides
   */
  collides(other) {
    return !(
      this.x + this.width < other.x ||
      this.y + this.height < other.y ||
      other.x + other.width < this.x ||
      other.y + other.height < this.y
    );
  }
}

/** Class representing a Player */
class Player {
  /**
   * Creates a Player Game object
   */
  constructor() {
    this.reset();
    this.body = new Rigidbody(this.x + 15, this.y + 60, 70, 85);

    const sprites = [
      'images/char-boy.png',
      'images/char-cat-girl.png',
      'images/char-horn-girl.png',
      'images/char-pink-girl.png',
      'images/char-princess-girl.png'
    ];

    this.sprite = sprites[Math.floor(Math.random() * 5)];
  }

  /**
   * Updates the player position
   */
  update() {
    this.body.x = this.x + 15;
    this.body.y = this.y + 60;

    // Check for collision with gem
    if (gem !== null && this.body.collides(gem.body)) {
      collectGem();
    }
  };

  /**
   * Renders object on board
   */
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };

  /**
   * Makes player object react on key press
   * @param {string} key Key
   */
  handleInput(key) {
    switch (key) {
      case 'left':
        this.x -= 100;
        break;
      case 'right':
        this.x += 100;
        break;
      case 'up':
        this.y -= 85;
        break;
      case 'down':
        this.y += 85;
        break;
    }

    this.fixOffscreen();

    if (this.waterReached()) {
      this.reset();
      levelUp();
    }
  }

  /**
   * Fixes player's object position on screen
   */
  fixOffscreen() {
    if (this.x > 400) {
      this.x = 400;
    }

    if (this.x < 0) {
      this.x = 0;
    }

    if (this.y > 400) {
      this.y = 400;
    }
  }

  /**
   * Checks if player's object reached the finish line
   * @returns {bool} True if reached finish line
   */
  waterReached() {
    return this.y < 60;
  }

  /**
   * Resets game object to initial position
   */
  reset() {
    this.x = 200;
    this.y = 400;
  }
}

/** Class representing an Enemy */
class Enemy {
  /**
   * Creates an Enemy Game object
   */
  constructor() {
    this.reset();
    this.body = new Rigidbody(this.x, this.y + 75, 100, 70);

    this.sprite = 'images/enemy-bug.png';
  }

  /**
   * Updates the enemy position
   * @param {number} dt Time Delta for smoothing
   */
  update(dt) {
    this.x += dt * this.speed;

    if (this.x > 505) {
      this.reset();
    }

    // Update collision body
    this.body.x = this.x;
    this.body.y = this.y + 75;

    // react to the collision
    if (this.collides(player)) {
      gameOver();
    }
  };

  /**
   * Renders object on board
   */
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };

  /**
   * Resets game object to initial position
   */
  reset() {
    this.x = -100;
    this.y = 50 + Math.floor(Math.random() * 3) * 85;
    this.speed = 100 + Math.floor(Math.random() * 100) * speedMultiplier;
  }

  /**
   * Checks for the collision with other object
   * @param {object} other Other object
   * @returns {bool} True if collides
   */
  collides(other) {
    return this.body.collides(other.body);
  }
}

/** Class representing a collectible */
class Gem {
  /**
   * Creates a Gem Game object
   */
  constructor() {
    this.reset();
    this.body = new Rigidbody(this.x + 15, this.y + 85, 70, 60);

    const sprites = [
      'images/gem-blue.png',
      'images/gem-green.png',
      'images/gem-orange.png'
    ];

    this.sprite = sprites[Math.floor(Math.random() * 3)];

    this.render();

    // Destroy this Gem
    setTimeout(() => {
      gem = null;
    }, 3000);
  }

  /**
   * Renders object on board
   */
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };

  /**
   * Resets game object to initial position
   */
  reset() {
    this.x = Math.floor(Math.random() * 5) * 101;
    this.y = 50 + Math.floor(Math.random() * 3) * 85;
  }
}

/** Game logic */

let level = 1;
let speedMultiplier = 0.1;
let collected = 0;

// Instantiate player
const player = new Player();

// Instantiate enemies
const allEnemies = new Array();
for (let i = 0; i < 2; i++) {
  allEnemies.push(new Enemy());
}

// Container for Gems
// Instantiate new Gem randomly
let gem = null;
setInterval(() => {
  gem = null;
  gem = new Gem();
}, 5000);

/**
 * Sets level of the game
 * @param {number} l Level
 */
function setLevel(l) {
  if (l === 1) {
    speedMultiplier = 0.1;
  }

  level = l;

  // Update level text in html
  const levelElements = document.getElementsByClassName('level');
  for(const el of levelElements) {
    el.innerText = level;
  }

  // Show splash screen
  const splashElements = document.getElementsByClassName('level-splash');
  splashElements[0].classList.add('level-splash-done');
  setTimeout(() => {
    splashElements[0].classList.remove('level-splash-done');
  }, 500);
}

/**
 * Increases the level
 */
function levelUp() {
  level++;

  if (level % 2 === 0) {
    speedMultiplier += 0.1;
  }

  if (level % 3 === 0) {
    allEnemies.push(new Enemy());
  }

  setLevel(level);
}

/**
 * Sets the collected gems number
 * @param {number} c Number of collected gems
 */
function setCollected(c) {
  collected = c;

  const levelElements = document.getElementsByClassName('gems');
  for(const el of levelElements) {
    el.innerText = collected;
  }
}

/**
 * Collects gems
 */
function collectGem() {
  collected++;
  gem = null;
  setCollected(collected);
}

/**
 * Resets the game
 */
function gameOver() {
  player.reset();
  allEnemies.length = 2;
  gem = null;
  setCollected(0);
  setLevel(1);
}

document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
