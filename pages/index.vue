<template>
  <section class="home">
    <div>
      <!-- <h1 class="mainTitle">Radoslav Tomas</h1> -->
      <Snake/>
    </div>
  </section>
</template>

<script>
import Snake from '~/components/Snake'
export default {
  components: {
    Snake
  }
}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/

.home {
  margin: 50px;
  position: relative;
  /* border: 1px solid black; */
}

.mainTitle {
  display: inline-block;
  padding: 20px;
  position: relative;
  top: -54px;
  font-family: 'Monoton', cursive;
  font-weight: 400;
  font-size: 55px;
}
</style>