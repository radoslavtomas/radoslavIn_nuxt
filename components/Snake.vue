<template>
  <div class="snakeWrap">
    <div class="flex justify-center items-center mb-2">
      <div id="score" class="text-5xl" ref="score">{{ score }}</div>
      <div v-if="showRestart" class="gameRestart text-center ml-3">
        <button
          @click="restartGame"
          class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 mt-1 rounded-full"
        >Start again?</button>
      </div>
    </div>

    <canvas ref="gameCanvas" id="gameCanvas" width="250" height="250"></canvas>

    <div class="mobileSnakeNav mt-3">
      <div class="firstRow">
        <div class="arrow-wrap" @click="changeDirection({keyCode: 38})">
          <div class="arrow">
            <div class="arrow-up"></div>
          </div>
        </div>
      </div>

      <div class="secondRow flex items-center justify-between">
        <div class="arrow-wrap" @click="changeDirection({keyCode: 37})">
          <div class="arrow">
            <div class="arrow-left"></div>
          </div>
        </div>

        <div class="arrow-wrap" @click="changeDirection({keyCode: 39})">
          <div class="arrow">
            <div class="arrow-right"></div>
          </div>
        </div>
      </div>

      <div class="thirdRow">
        <div class="arrow-wrap" @click="changeDirection({keyCode: 40})">
          <div class="arrow">
            <div class="arrow-down"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      gameSpeed: 250,
      canvasBorderColor: 'black',
      canvasBackgroundColor: 'white',
      snakeColor: 'lightgreen',
      snakeBorderColor: 'darkgreen',
      foodColor: 'red',
      foodBorderColor: 'darkred',
      snake: [
        { x: 160, y: 160 },
        { x: 150, y: 160 },
        { x: 140, y: 160 },
        { x: 130, y: 160 },
        { x: 120, y: 160 }
      ],
      score: 0,
      changingDirection: false,
      foodX: null,
      foodY: null,
      dx: 10,
      dy: 0,
      showRestart: false,
      windowWidth: null
    }
  },
  methods: {
    getCanvas() {
      const gameCanvas = document.getElementById('gameCanvas')
      return gameCanvas
    },
    getContext() {
      const canvas = this.getCanvas()
      let ctx = canvas.getContext('2d')
      return ctx
    },
    clearCanvas() {
      const canvas = this.getCanvas()
      let ctx = this.getContext()
      //  Select the colour to fill the drawing
      ctx.fillStyle = this.canvasBackgroundColor
      //  Select the colour for the border of the canvas
      ctx.strokestyle = this.canvasBorderColor
      // Draw a "filled" rectangle to cover the entire canvas
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      // Draw a "border" around the entire canvas
      ctx.strokeRect(0, 0, canvas.width, canvas.height)
    },
    drawSnakePart(snakePart) {
      let ctx = this.getContext()
      ctx.fillStyle = this.snakeColor
      ctx.strokestyle = this.snakeBorderColor
      ctx.fillRect(snakePart.x, snakePart.y, 10, 10)
      ctx.strokeRect(snakePart.x, snakePart.y, 10, 10)
    },
    drawSnake() {
      // loop through the snake parts drawing each part on the canvas
      this.snake.forEach(this.drawSnakePart)
    },
    randomTen(min, max) {
      return Math.round((Math.random() * (max - min) + min) / 10) * 10
    },
    drawFood() {
      let ctx = this.getContext()
      ctx.fillStyle = this.foodColor
      ctx.strokestyle = this.foodBorderColor
      ctx.fillRect(this.foodX, this.foodY, 10, 10)
      ctx.strokeRect(this.foodX, this.foodY, 10, 10)
    },
    createFood() {
      const gameCanvas = this.getCanvas()
      // Generate a random number the food x-coordinate
      this.foodX = this.randomTen(0, gameCanvas.width - 10)
      // Generate a random number for the food y-coordinate
      this.foodY = this.randomTen(0, gameCanvas.height - 10)
      // if the new food location is where the snake currently is, generate a new food location
      this.snake.forEach(part => {
        const foodIsoNsnake = part.x == this.foodX && part.y == this.foodY
        if (foodIsoNsnake) {
          this.createFood()
        }
      })
    },
    advanceSnake() {
      // Create the new Snake's head
      const head = {
        x: this.snake[0].x + this.dx,
        y: this.snake[0].y + this.dy
      }
      // Add the new head to the beginning of snake body
      this.snake.unshift(head)

      const didEatFood =
        this.snake[0].x === this.foodX && this.snake[0].y === this.foodY
      if (didEatFood) {
        // Increase score
        this.score += 10
        // Generate new food location
        this.createFood()
      } else {
        // Remove the last part of snake body
        this.snake.pop()
      }
    },
    changeDirection(event) {
      const LEFT_KEY = 37
      const RIGHT_KEY = 39
      const UP_KEY = 38
      const DOWN_KEY = 40
      /**
       * Prevent the snake from reversing
       * Example scenario:
       * Snake is moving to the right. User presses down and immediately left
       * and the snake immediately changes direction without taking a step down first
       */
      if (this.changingDirection) return
      this.changingDirection = true

      const keyPressed = event.keyCode
      const goingUp = this.dy === -10
      const goingDown = this.dy === 10
      const goingRight = this.dx === 10
      const goingLeft = this.dx === -10
      if (keyPressed === LEFT_KEY && !goingRight) {
        this.dx = -10
        this.dy = 0
      }

      if (keyPressed === UP_KEY && !goingDown) {
        this.dx = 0
        this.dy = -10
      }

      if (keyPressed === RIGHT_KEY && !goingLeft) {
        this.dx = 10
        this.dy = 0
      }

      if (keyPressed === DOWN_KEY && !goingUp) {
        this.dx = 0
        this.dy = 10
      }
    },
    didGameEnd() {
      for (let i = 4; i < this.snake.length; i++) {
        if (
          this.snake[i].x === this.snake[0].x &&
          this.snake[i].y === this.snake[0].y
        )
          return true
      }
      const hitLeftWall = this.snake[0].x < 0
      const hitRightWall = this.snake[0].x > gameCanvas.width - 20
      const hitToptWall = this.snake[0].y < 0
      const hitBottomWall = this.snake[0].y > gameCanvas.height - 20
      return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
    },
    restartGame() {
      this.gameSpeed = 250
      this.showRestart = false
      this.snake = [
        { x: 160, y: 160 },
        { x: 150, y: 160 },
        { x: 140, y: 160 },
        { x: 130, y: 160 },
        { x: 120, y: 160 }
      ]
      this.score = 0
      this.changingDirection = false
      this.foodX = null
      this.foodY = null
      this.dx = 10
      this.dy = 0
      this.createFood()
      this.main()
    },
    main() {
      if (this.didGameEnd()) {
        this.showRestart = true
        return
      }
      setTimeout(() => {
        this.changingDirection = false
        this.clearCanvas()
        this.drawFood()
        this.advanceSnake()
        this.drawSnake()
        this.main()
      }, this.gameSpeed)
    }
  },
  watch: {
    score() {
      if (this.score >= 50) {
        this.gameSpeed = 200
      }

      if (this.score >= 100) {
        this.gameSpeed = 150
      }

      if (this.score >= 150) {
        this.gameSpeed = 100
      }
    }
  },
  mounted() {
    document.addEventListener('keydown', event => {
      event.preventDefault()
      this.changeDirection(event)
    })

    this.createFood()
    this.main()
  }
}
</script>

<style scoped>
.snakeWrap {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.arrow-wrap {
  width: 60px;
  height: 60px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 4px solid #000;
  border-radius: 50%;
}

.arrow {
  position: relative;
  margin: 0 auto;
  width: 40px;
  height: 40px;
  cursor: pointer;
}

/* ARROW RIGHT */

.arrow .arrow-right {
  position: absolute;
  top: 17px;
  width: 90%;
  height: 6px;
  background-color: #000;
}

.arrow .arrow-right::after {
  content: '';
  position: absolute;
  width: 60%;
  height: 6px;
  top: -6px;
  right: -8px;
  background-color: #000;
  transform: rotate(45deg);
}

.arrow .arrow-right::before {
  content: '';
  position: absolute;
  width: 60%;
  height: 6px;
  top: 6px;
  right: -8px;
  background-color: #000;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  transform: rotate(-45deg);
}

/* ARROW LEFT */

.arrow .arrow-left {
  position: absolute;
  top: 17px;
  left: 5px;
  width: 90%;
  height: 6px;
  background-color: #000;
}

.arrow .arrow-left::after {
  content: '';
  position: absolute;
  width: 60%;
  height: 6px;
  top: -6px;
  left: -8px;
  background-color: #000;
  transform: rotate(-45deg);
}

.arrow .arrow-left::before {
  content: '';
  position: absolute;
  width: 60%;
  height: 6px;
  top: 6px;
  left: -8px;
  background-color: #000;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  transform: rotate(45deg);
}

/* ARROW UP */

.arrow .arrow-up {
  position: absolute;
  top: 5px;
  right: 17px;
  width: 6px;
  height: 90%;
  background-color: #000;
}

.arrow .arrow-up::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 60%;
  top: -8px;
  right: -6px;
  background-color: #000;
  transform: rotate(-45deg);
}

.arrow .arrow-up::before {
  content: '';
  position: absolute;
  width: 6px;
  height: 60%;
  top: -8px;
  left: -6px;
  background-color: #000;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  transform: rotate(45deg);
}

/* ARROW DOWN */

.arrow .arrow-down {
  position: absolute;
  right: 17px;
  width: 6px;
  height: 90%;
  background-color: #000;
}

.arrow .arrow-down::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 60%;
  bottom: -8px;
  right: -6px;
  background-color: #000;
  transform: rotate(45deg);
}

.arrow .arrow-down::before {
  content: '';
  position: absolute;
  width: 6px;
  height: 60%;
  bottom: -8px;
  left: -6px;
  background-color: #000;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  transform: rotate(-45deg);
}

.mobileSnakeNav {
  width: 240px;
}

.firstRow {
  position: relative;
  top: 10px;
}

.thirdRow {
  position: relative;
  top: -10px;
}
</style>