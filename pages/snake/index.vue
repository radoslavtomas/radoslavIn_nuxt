<template>
  <section class="snake md:p-12 p-5">
    <Snake/>

    <div class="mt-8 text-center">
      <nuxt-link
        class="no-underline text-grey-darkest hover:text-black font-bold text-2xl border-2 border-grey-darkest hover:border-black rounded p-4"
        to="/"
      >Home</nuxt-link>
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

<style lang="scss" scoped>
</style>