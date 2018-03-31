/** Class representing physical object body for collisions */
class Rigidbody {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * @description Checks if current body collides with other Rigidbody
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
  constructor() {
    this.sprite = 'images/char-boy.png';
    this.body = new Rigidbody(this.x + 15, this.y + 60, 70, 85);

    this.reset();
  }

  update(dt) {
    this.body.x = this.x + 15;
    this.body.y = this.y + 60;
  };

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };

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

  waterReached() {
    return this.y < 60;
  }

  reset() {
    this.x = 200;
    this.y = 400;
  }
}

/** Class representing an Enemy */
class Enemy {
  constructor() {
    this.sprite = 'images/enemy-bug.png';
    this.body = new Rigidbody(this.x, this.y + 75, 100, 70);

    this.reset();
  }

  update(dt) {
    this.x += dt * this.speed;

    if (this.x > 505) {
      this.reset();
    }

    // Update collision body
    this.body.x = this.x;
    this.body.y = this.y + 75;

    // rect to the collision
    if (this.body.collides(player.body)) {
      player.reset();
      allEnemies.length = 2;
      setLevel(1);
    }
  };

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };

  reset() {
    this.x = -100;
    this.y = 50 + Math.floor(Math.random() * 3) * 85;
    this.speed = 100 + Math.floor(Math.random() * 100) * speedMultiplier;
  }
}

/** Game logic */
let level = 1;
let enemies = 2;
let speedMultiplier = 0.1;

// Instantiate player
const player = new Player();

// Instantiate enemies
const allEnemies = new Array();
for (let i = 0; i < enemies; i++) {
  allEnemies.push(new Enemy());
}

function setLevel(l) {
  level = l;

  // Update level text in html
  const levelElements = document.getElementsByClassName('level');
  for(const el of levelElements) {
    el.innerText = level;
  }

  const splashElements = document.getElementsByClassName('level-splash');
  splashElements[0].classList.add('level-splash-done');
  setTimeout(() => {
    splashElements[0].classList.remove('level-splash-done');
  }, 1000);
}

function levelUp() {
  level++;
  enemies++;

  if (level % 2 === 0) {
    speedMultiplier += 0.1;
  }

  if (level % 3 === 0) {
    allEnemies.push(new Enemy());
  }

  setLevel(level);
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
