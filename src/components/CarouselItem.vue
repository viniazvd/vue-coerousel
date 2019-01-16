<template>
  <div class="carousel-item" :style="{ flex }">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'carousel-item',

  inject: ['data'],

  computed: {
    flex () {
      return '1 0 ' + (100 / this.data.internalPerPage) + '%'
    },

    isDraggable () {
      return this.data.isDraggable && !this.data.isLoopable
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
