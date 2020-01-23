// Create our 'main' state that will contain the game
class mainScene {
  preload() {
    // Load the bird & pipe sprites
    this.load.image("bird", "assets/bird.png");
    this.load.image("pipe", "assets/pipe.png");
  }

  create() {
    // Display the bird at the position x=100 and y=245
    this.bird = this.physics.add.sprite(100, 245, "bird");

    // Add gravity to the bird to make it fall
    this.bird.body.gravity.y = 1000;

    // Register spacebar key
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // Create an empty group
    this.pipes = this.add.group();

    // Add row of pipes every 1.5 seconds
    this.time.addEvent({
      delay: 1500,
      callback: this.addRowOfPipes,
      callbackScope: this,
      loop: true
    });

    // Keep track of score
    this.score = 0;
    this.labelScore = this.add.text(20, 20, "0", {
      font: "30px Arial",
      fill: "#ffffff"
    });
  }

  update() {
    // If the bird is out of the screen (too high or too low) call the 'restartGame' function
    if (this.bird.y < 0 || this.bird.y > 490) {
      this.restartGame();
    }

    // Call the 'jump' function when the spacebar key is hit
    if (this.spacebar.isDown) {
      this.jump();
    }

    // Restart game if bird collides with pipes
    this.physics.overlap(this.bird, this.pipes, this.restartGame, null, this);
  }

  // Make the bird jump
  jump() {
    // Add a vertical velocity to the bird
    this.bird.body.velocity.y = -350;
  }

  // Restart the game
  restartGame() {
    this.scene.start();
  }

  addOnePipe(x, y) {
    // Create a pipe at the position x and y
    const pipe = this.physics.add.sprite(x, y, "pipe");

    // Add the pipe to our previously created group
    this.pipes.add(pipe);

    // Enable physics on the pipe
    // this.physics.enable(pipe);

    // Add velocity to the pipe to make it move left
    pipe.body.velocity.x = -200;

    // Automatically kill the pipe when it's no longer visible
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
  }

  addRowOfPipes() {
    // Randomly pick a number between 1 and 5
    // This will be the hole position
    const hole = Math.floor(Math.random() * 5) + 1;

    // Add the 6 pipes
    // With one big hole at position 'hole' and 'hole + 1'
    for (var i = 0; i < 8; i++) {
      if (i != hole && i != hole + 1) {
        this.addOnePipe(400, i * 60 + 35);
      }
    }

    // Every time a new pipe row is created, add to score
    this.score += 1;
    this.labelScore.text = this.score;
  }
}

new Phaser.Game({
  width: 400, // Width of the game in pixels
  height: 490, // Height of the game in pixels
  backgroundColor: "#71c5cf", // The background color (blue)
  scene: mainScene, // The name of the scene we created
  physics: { default: "arcade" }, // The physics engine to use (Needed for: movements, gravity, collisions, etc.)
  parent: "game" // Create the game inside the <div id="game">
});
