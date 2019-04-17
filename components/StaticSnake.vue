<template>
  <div>
    <div class="snakeWrap mb-12">
      <transition name="felldown">
        <div
          v-if="score == 50"
          class="snake-layer h-full flex justify-center items-center absolute"
        >
          <nuxt-link
            class="no-underline text-white hover:text-grey font-bold text-2xl border-2 border-white hover:border-grey rounded p-4"
            to="/snake"
          >Play your game</nuxt-link>
        </div>
      </transition>
      <canvas ref="gameCanvas" id="gameCanvas" width="250" height="250"></canvas>
    </div>

    <div class="clearfix h-10 max-w-md mx-auto">
      <transition name="flyin">
        <div v-if="score >= 10" class="w-1/5 h-10 text-center float-left">
          <img class="h-full" src="~assets/img/tech_stack_img/html.png" alt="html logo">
        </div>
      </transition>

      <transition name="flyin">
        <div v-if="score >= 20" class="w-1/5 h-10 text-center float-left">
          <img class="h-full" src="~assets/img/tech_stack_img/css3.png" alt="html logo">
        </div>
      </transition>

      <transition name="flyin">
        <div v-if="score >= 30" class="w-1/5 h-10 text-center float-left">
          <img class="h-full" src="~assets/img/tech_stack_img/js.png" alt="html logo">
        </div>
      </transition>

      <transition name="flyin">
        <div v-if="score >= 40" class="w-1/5 h-10 text-center float-left">
          <img class="h-full" src="~assets/img/tech_stack_img/vue.png" alt="html logo">
        </div>
      </transition>

      <transition name="flyin">
        <div v-if="score >= 50" class="w-1/5 h-10 text-center float-left">
          <img class="h-full" src="~assets/img/tech_stack_img/laravel.png" alt="html logo">
        </div>
      </transition>
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
    createFood(x, y) {
      const gameCanvas = this.getCanvas()
      // Generate a random number the food x-coordinate
      this.foodX = x
      // Generate a random number for the food y-coordinate
      this.foodY = y

      this.drawFood()
    },
    advanceSnake(didEat = false) {
      // Create the new Snake's head
      const head = {
        x: this.snake[0].x + this.dx,
        y: this.snake[0].y + this.dy
      }
      // Add the new head to the beginning of snake body
      this.snake.unshift(head)

      if (didEat) {
        // Increase score
        this.score += 10
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
    step1() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(200, 200)
        this.advanceSnake()
        this.drawSnake()

        this.step2()
      }, this.gameSpeed)
    },
    step2() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(200, 200)
        this.advanceSnake()
        this.drawSnake()

        this.step3()
      }, this.gameSpeed)
    },
    step3() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(200, 200)
        this.advanceSnake()
        this.drawSnake()

        this.step4()
      }, this.gameSpeed)
    },
    step4() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(200, 200)
        this.advanceSnake()
        this.drawSnake()
        this.changeDirection({ keyCode: 40 })
        this.step5()
      }, this.gameSpeed)
    },
    step5() {
      setTimeout(() => {
        this.changingDirection = false
        this.clearCanvas()
        this.createFood(200, 200)
        this.advanceSnake()
        this.drawSnake()

        this.step6()
      }, this.gameSpeed)
    },
    step6() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(200, 200)
        this.advanceSnake()
        this.drawSnake()

        this.step7()
      }, this.gameSpeed)
    },
    step7() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(200, 200)
        this.advanceSnake()
        this.drawSnake()

        this.step8()
      }, this.gameSpeed)
    },
    step8() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(160, 200)
        this.advanceSnake(true)
        this.drawSnake()

        this.step9()
      }, this.gameSpeed)
    },
    step9() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(160, 200)
        this.advanceSnake()
        this.drawSnake()

        this.step10()
      }, this.gameSpeed)
    },
    step10() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(160, 200)
        this.advanceSnake()
        this.drawSnake()
        this.changeDirection({ keyCode: 37 })
        this.step11()
      }, this.gameSpeed)
    },
    step11() {
      setTimeout(() => {
        this.changingDirection = false
        this.clearCanvas()
        this.createFood(160, 200)
        this.advanceSnake()
        this.drawSnake()

        this.step12()
      }, this.gameSpeed)
    },
    step12() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(160, 200)
        this.advanceSnake()
        this.drawSnake()

        this.step13()
      }, this.gameSpeed)
    },
    step13() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(160, 200)
        this.advanceSnake()
        this.drawSnake()

        this.step14()
      }, this.gameSpeed)
    },
    step14() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(160, 200)
        this.advanceSnake()
        this.drawSnake()
        this.changeDirection({ keyCode: 38 })
        this.step15()
      }, this.gameSpeed)
    },
    step15() {
      setTimeout(() => {
        this.changingDirection = false
        this.clearCanvas()
        this.createFood(160, 200)
        this.advanceSnake()
        this.drawSnake()
        this.step16()
      }, this.gameSpeed)
    },
    step16() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(160, 140)
        this.advanceSnake(true)
        this.drawSnake()
        this.step17()
      }, this.gameSpeed)
    },
    step17() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(160, 140)
        this.advanceSnake()
        this.drawSnake()
        this.step18()
      }, this.gameSpeed)
    },
    step18() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(160, 140)
        this.advanceSnake()
        this.drawSnake()
        this.step19()
      }, this.gameSpeed)
    },
    step19() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(160, 140)
        this.advanceSnake()
        this.drawSnake()
        this.step20()
      }, this.gameSpeed)
    },
    step20() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(160, 140)
        this.advanceSnake()
        this.drawSnake()
        this.step21()
      }, this.gameSpeed)
    },
    step21() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(160, 140)
        this.advanceSnake()
        this.drawSnake()
        this.step22()
      }, this.gameSpeed)
    },
    step22() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(50, 110)
        this.advanceSnake(true)
        this.drawSnake()
        this.step23()
      }, this.gameSpeed)
    },
    step23() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(50, 110)
        this.advanceSnake()
        this.drawSnake()
        this.step24()
      }, this.gameSpeed)
    },
    step24() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(50, 110)
        this.advanceSnake()
        this.drawSnake()
        this.changeDirection({ keyCode: 37 })
        this.step25()
      }, this.gameSpeed)
    },
    step25() {
      setTimeout(() => {
        this.changingDirection = false
        this.clearCanvas()
        this.createFood(50, 110)
        this.advanceSnake()
        this.drawSnake()
        this.step26()
      }, this.gameSpeed)
    },
    step26() {
      setTimeout(() => {
        this.changingDirection = false
        this.clearCanvas()
        this.createFood(50, 110)
        this.advanceSnake()
        this.drawSnake()
        this.changeDirection({ keyCode: 38 })
        this.step27()
      }, this.gameSpeed)
    },
    step27() {
      setTimeout(() => {
        this.changingDirection = false
        this.clearCanvas()
        this.createFood(50, 110)
        this.advanceSnake()
        this.drawSnake()
        this.changeDirection({ keyCode: 37 })
        this.step28()
      }, this.gameSpeed)
    },
    step28() {
      setTimeout(() => {
        this.changingDirection = false
        this.clearCanvas()
        this.createFood(50, 110)
        this.advanceSnake()
        this.drawSnake()
        this.step29()
      }, this.gameSpeed)
    },
    step29() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(50, 110)
        this.advanceSnake()
        this.drawSnake()
        this.step30()
      }, this.gameSpeed)
    },
    step30() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(50, 110)
        this.advanceSnake()
        this.drawSnake()
        this.step31()
      }, this.gameSpeed)
    },
    step31() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(50, 110)
        this.advanceSnake()
        this.drawSnake()
        this.step32()
      }, this.gameSpeed)
    },
    step32() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(50, 110)
        this.advanceSnake()
        this.drawSnake()
        this.step33()
      }, this.gameSpeed)
    },
    step33() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(50, 110)
        this.advanceSnake()
        this.drawSnake()
        this.step34()
      }, this.gameSpeed)
    },
    step34() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(50, 110)
        this.advanceSnake()
        this.drawSnake()
        this.step35()
      }, this.gameSpeed)
    },
    step35() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(80, 90)
        this.advanceSnake(true)
        this.drawSnake()
        this.step36()
      }, this.gameSpeed)
    },
    step36() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(80, 90)
        this.advanceSnake()
        this.drawSnake()
        this.step37()
      }, this.gameSpeed)
    },
    step37() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(80, 90)
        this.advanceSnake()
        this.drawSnake()
        this.changeDirection({ keyCode: 38 })
        this.step38()
      }, this.gameSpeed)
    },
    step38() {
      setTimeout(() => {
        this.changingDirection = false
        this.clearCanvas()
        this.createFood(80, 90)
        this.advanceSnake()
        this.drawSnake()
        this.step39()
      }, this.gameSpeed)
    },
    step39() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(80, 90)
        this.advanceSnake()
        this.drawSnake()
        this.changeDirection({ keyCode: 39 })
        this.step40()
      }, this.gameSpeed)
    },
    step40() {
      setTimeout(() => {
        this.changingDirection = false
        this.clearCanvas()
        this.createFood(80, 90)
        this.advanceSnake()
        this.drawSnake()
        this.step41()
      }, this.gameSpeed)
    },
    step41() {
      setTimeout(() => {
        this.changingDirection = false
        this.clearCanvas()
        this.createFood(80, 90)
        this.advanceSnake()
        this.drawSnake()
        this.step42()
      }, this.gameSpeed)
    },
    step42() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(80, 90)
        this.advanceSnake()
        this.drawSnake()
        this.step43()
      }, this.gameSpeed)
    },
    step43() {
      setTimeout(() => {
        this.clearCanvas()
        this.createFood(80, 90)
        this.advanceSnake(true)
        this.drawSnake()
        // this.step43()
      }, this.gameSpeed)
    },
    main() {
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
  mounted() {
    this.step1()
    // this.main()
  }
}
</script>

<style scoped lang="scss">
.snakeWrap {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.snake-layer {
  width: 250px;
  background-color: rgba(158, 54, 142, 0.8);
}

.felldown-enter-active {
  transition: all 0.3s ease-in-out;
  transform-origin: top;
}
.felldown-enter {
  opacity: 0;
  transform: scaleY(0);
}
</style>