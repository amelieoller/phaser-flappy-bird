const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 490,
  backgroundColor: "#71c5cf",
  physics: {
    default: "arcade"
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let pipes;
let spacebar;
let bird;
let score;
let labelScore;

new Phaser.Game(config);

function preload() {
  // Load the bird & pipe sprites
  this.load.image("bird", "assets/bird.png");
  this.load.image("pipe", "assets/pipe.png");
}

function create() {
  // Display the bird at the position x=100 and y=245
  bird = this.physics.add.sprite(100, 245, "bird");

  // Add gravity to the bird to make it fall
  bird.body.gravity.y = 1000;

  // Register spacebar key
  spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  // Create an empty group
  pipes = this.physics.add.group();

  // Add row of pipes every 1.5 seconds
  this.time.addEvent({
    delay: 1500,
    callback: addRowOfPipes,
    callbackScope: this,
    loop: true
  });

  // Keep track of score
  score = 0;
  labelScore = this.add.text(20, 20, "0", {
    font: "30px Arial",
    fill: "#ffffff"
  });
}

function update() {
  // Restart the game
  const restartGame = () => {
    this.scene.start();
  };

  // Make the bird jump
  const jump = () => {
    // Add a vertical velocity to the bird
    bird.body.velocity.y = -350;
  };

  // If the bird is out of the screen (too high or too low) call the 'restartGame' function
  if (bird.y < 0 || bird.y > 490) {
    restartGame();
  }

  // Call the 'jump' function when the spacebar key is hit
  if (spacebar.isDown) {
    jump();
  }

  // Restart game if bird collides with pipes
  this.physics.add.overlap(bird, pipes, restartGame);
}

function addRowOfPipes() {
  // Randomly pick a number between 1 and 5
  // This will be the hole position
  const hole = Math.floor(Math.random() * 5) + 1;

  // Add the 6 pipes
  // With one big hole at position 'hole' and 'hole + 1'
  for (let i = 0; i < 8; i++) {
    if (i !== hole && i !== hole + 1) {
      const pipe = this.physics.add.sprite(400, i * 60 + 35, "pipe");

      // Add the pipe to our previously created group
      pipes.add(pipe);

      // Add velocity to the pipe to make it move left
      pipe.body.velocity.x = -200;

      // Automatically kill the pipe when it's no longer visible
      pipe.checkWorldBounds = true;
      pipe.outOfBoundsKill = true;
    }
  }

  // Every time a new pipe row is created, add to score
  score += 1;
  labelScore.text = score;
}
