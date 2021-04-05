<script>

// <template>
//   <div class="carousel-item" :style="{ flex }">
//     <slot />
//   </div>
// </template>

export default {
  name: 'Slide',

  inject: ['data'],

  computed: {
    flex () {
      return { flex: '1 0 ' + (100 / this.data.internalPerPage) + '%' }
    },

    isDraggable () {
      return this.data.isDraggable && !this.data.isLoopable
    }
  },

  render (h) {
    return h('div', { style: this.flex, staticClass: 'carousel-item' }, this.$slots.default)
  }
}
</script>

<style lang="scss">
.carousel-item {
  display: flex;
  user-select: none;
  outline: none;
  overflow: hidden;
}
</style>
