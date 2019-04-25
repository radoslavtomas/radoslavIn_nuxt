<template>
  <section class="home md:p-12 p-5">
    <div class="mainTitle text-3xl md:text-5xl text-center">
      <p>Radoslav</p>
      <p>Tomas</p>
    </div>

    <div class="subTitle text-center mt-4">
      <h4>creative full stack development</h4>
    </div>

    <div class="static-snake-wrap mt-6 mb-12">
      <StaticSnake/>
    </div>

    <div class="clearfix h-10 max-w-md mx-auto">
      <transition name="flyin">
        <div v-if="val >= 10" class="w-1/5 h-10 text-center float-left">
          <img class="h-full" src="~assets/img/tech_stack_img/html.png" alt="html logo">
        </div>
      </transition>

      <transition name="flyin">
        <div v-if="val >= 20" class="w-1/5 h-10 text-center float-left">
          <img class="h-full" src="~assets/img/tech_stack_img/css3.png" alt="html logo">
        </div>
      </transition>

      <transition name="flyin">
        <div v-if="val >= 30" class="w-1/5 h-10 text-center float-left">
          <img class="h-full" src="~assets/img/tech_stack_img/js.png" alt="html logo">
        </div>
      </transition>

      <transition name="flyin">
        <div v-if="val >= 40" class="w-1/5 h-10 text-center float-left">
          <img class="h-full" src="~assets/img/tech_stack_img/vue.png" alt="html logo">
        </div>
      </transition>

      <transition name="flyin">
        <div v-if="val >= 50" class="w-1/5 h-10 text-center float-left">
          <img class="h-full" src="~assets/img/tech_stack_img/laravel.png" alt="html logo">
        </div>
      </transition>
    </div>
  </section>
</template>

<script>
import StaticSnake from '~/components/StaticSnake'
export default {
  data() {
    return {
      val: 0
    }
  },
  components: {
    StaticSnake
  }
}
</script>

<style lang="scss">
/* Sample `apply` at-rules with Tailwind CSS
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/

.home {
  /* margin: 50px; */
  position: relative;
  /* border: 1px solid black; */
}

.mainTitle {
  font-family: 'Monoton', cursive;

  p:first-child {
    padding-right: 80px;
  }

  p:last-child {
    padding-left: 100px;
  }
}

.flyin-enter-active {
  transition: all 0.3s ease-in-out;
  // transform-origin: top;
}
.flyin-enter {
  opacity: 0;
  transform: translateX(500px);
}
</style>