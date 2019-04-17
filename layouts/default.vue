<template>
  <div>
    <div class="page-border-decor"></div>
    <nuxt/>
  </div>
</template>

<style lang="scss">
.page-border-decor {
  border: 10px solid #6bd8d8;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: -1;
}

@screen md {
  .page-border-decor {
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
  }
}
</style>
