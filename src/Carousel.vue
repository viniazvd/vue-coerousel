
<template>
  <div class="vue-coerousel">
    <button @click="position -= 30">+</button>
    position: {{ position }}

    <div class="wrapper">
      <div ref="carousel" class="inner" :style="style">
        <slot></slot>
      </div>
    </div>

    <!-- <slot v-if="false" name="navigation">
      <navigation
        :next="navigationNext"
        :prev="navigationPrev"
        @navigation-click="handleNavigation"
      />
    </slot>

    <slot v-if="paginationEnabled" name="pagination">
      <pagination @paginationclick="goToPage($event, 'pagination')"/>
    </slot> -->
  </div>
</template>
<script>

export default {
  name: 'vue-coe-carousel',

  // components: {
  //   Navigation: () => import('./components/Navigation'),
  //   Pagination: () => import('./components/Pagination')
  // }

  props: {
    perPage: {
      type: [String, Number],
      default: 1
    },
    isDraggable: {
      type: Boolean,
      default: true
    },
    isLoopable: Boolean,
    loopDelay: {
      type: [String, Number],
      default: 1000
    }
  },

  data () {
    return {
      initPosition: null,
      position: 0
    }
  },

  mounted () {
    // console.log(this.$refs.carousel.clientWidth)

    this.isLoopable && this.initLoop()

    this.$children.forEach(c => c.$on('init-position', ({ clientX }) => {
      this.initPosition = ~~(clientX / 10) - this.position
    }))

    this.$children.forEach(c => c.$on('move-position', ({ clientX }) => {
      const slipped = ~~((clientX / 10) - this.initPosition)

      this.position = slipped

      if (this.position > 0) this.position -= slipped
      if (this.position < this.endPosition) this.position = this.endPosition
    }))

    this.$children.forEach(c => c.$on('set-position', ({ clientX }) => {
      this.initPosition = null
    }))
  },

  computed: {
    itemSize () {
      return 100 / this.perPage
    },

    endPosition () {
      const itemsNum = this.$children.length

      return -(this.itemSize * itemsNum) + 100
    },

    style () {
      return { transform: `translateX(${this.position}%)` }
    }
  },

  methods: {
    startLoop () {
      return ~~this.position <= 0 && this.position > this.endPosition
        ? (this.position -= this.itemSize)
        : (this.position = 0)
    },

    initLoop () {
      window.setInterval(this.startLoop, 500)
    }
  }
}
</script>

<style lang="scss">
.vue-coerousel {
  // ...

  & > .wrapper {
    overflow: hidden;
    max-height: 300px;
    background-color: gray;

    & > .inner {
      display: flex;
      transition: transform .3s;
      transform: var(--transform);
    }
  }
}
</style>
