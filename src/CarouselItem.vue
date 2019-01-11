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
    }
  },

  methods: {
    // mousemove (e) {
    //   console.log('mousemove')
    //   this.$emit('move-position', e)
    // },

    mousedown (e) {
      console.log('mousedown')
      this.$emit('init-pointer', e)
      // window.addEventListener('mousemove', this.mousemove)
      // window.addEventListener('mouseup', () => window.removeEventListener('mousemove', this.mousemove))
    },

    mouseup (e) {
      console.log('mouseup')
      this.$emit('set-pointer', e)
    }
  }
}
</script>

<style lang="scss">
.carousel-item {
  padding: { left: 10px; right: 10px; }
  user-select: none;
  outline: none;
  width: 300px;
  overflow: hidden;
}
</style>
