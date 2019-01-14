<template>
  <div
    class="carousel-item"
    :style="{ flex }"
    @mousedown="mousedown"
    @mouseup="mouseup"
  >
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
  },

  methods: {
    mousemove (e) {
      this.$emit('move-position', e)
    },

    mousedown (e) {
      if (!this.isDraggable) return false

      this.$emit('init-position', e)

      window.addEventListener('mousemove', this.mousemove)
      window.addEventListener('mouseup', () => window.removeEventListener('mousemove', this.mousemove))
    },

    mouseup (e) { // touchend ?
      if (!this.isDraggable) return false

      this.$emit('set-position', e)
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
