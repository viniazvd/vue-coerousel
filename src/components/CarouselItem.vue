<template>
  <div class="carousel-item" :style="{ flex }">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'carousel-item',

  computed: {
    flex () {
      return '1 0 ' + (100 / this.$parent.perPage) + '%'
    },

    isDraggable () {
      return this.$parent.isDraggable && !this.$parent.isLoopable
    }
  }
}
</script>

<style lang="scss">
.carousel-item {
  // padding: { left: 10px; right: 10px; }
  user-select: none;
  outline: none;
  width: 300px;
  overflow: hidden;
}
</style>
