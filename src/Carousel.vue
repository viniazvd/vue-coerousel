
<template>
  <div class="vue-coerousel">
    position: {{ position }}

    <div class="wrapper">
      <div class="inner" :style="style" @mousedown="mousedown">
        <slot></slot>
      </div>
    </div>

    <pagination v-if="pagination" />
  </div>
</template>

<script>
import Pagination from './components/Pagination'

export default {
  name: 'vue-coerousel',

  components: { Pagination },

  props: {
    pagination: {
      type: Boolean,
      default: true
    },
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
    },
    breakpoints: {
      type: Object,
      default: () => ({})
    }
  },

  data () {
    return {
      initPosition: null,
      position: 0,
      currentWidth: 0
    }
  },

  provide () {
    const options = {}

    const define = (name, get) => Object.defineProperty(options, name, { get, enumerable: true })

    define('childrens', () => this.$children.length - 1)
    define('data', () => this)

    return options
  },

  mounted () {
    this.isLoopable && this.initLoop()

    this.hasBreakpoints && this.setCurrentWidth({ target: { innerWidth: document.body.clientWidth } })

    window.addEventListener('resize', this.setCurrentWidth)
  },

  computed: {
    itemSize () {
      return 100 / this.internalPerPage
    },

    endPosition () {
      const itemsNum = this.$children.length

      return -(this.itemSize * itemsNum) + (100 + this.itemSize)
    },

    hasBreakpoints () {
      return !!Object.keys(this.breakpoints).length
    },

    internalPerPage () {
      const breakpoints = this.breakpoints
      const width = this.currentWidth

      return this.hasBreakpoints && breakpoints[width] ? breakpoints[width].perPage : this.perPage
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
      window.setInterval(this.startLoop, this.loopDelay)
    },

    setCurrentWidth ({ target: { innerWidth } }) {
      if (innerWidth >= 1024) this.currentWidth = 1024
      if (innerWidth <= 1024 && innerWidth >= 769) this.currentWidth = 768
      if (innerWidth <= 768 && innerWidth >= 641) this.currentWidth = 640
      if (innerWidth <= 640 && innerWidth >= 320) this.currentWidth = 320
    },

    mousemove ({ clientX }) {
      const slipped = ~~((clientX / 10) - this.initPosition)

      this.position = slipped

      if (this.position > 0) this.position -= slipped
      if (this.position < this.endPosition) this.position = this.endPosition
    },

    mousedown ({ clientX }) {
      if (!this.isDraggable) return false

      this.initPosition = ~~(clientX / 10) - this.position

      window.addEventListener('mousemove', this.mousemove)
      window.addEventListener('mouseup', this.mouseup)
    },

    mouseup () { // touchend ?
      if (!this.isDraggable) return false

      const position = this.position / this.itemSize
      const isCenter = !String(position).split('').includes('.')

      if (!isCenter && this.position >= this.endPosition) this.position = (Math.round(this.position / this.itemSize) * 100) / this.internalPerPage

      this.initPosition = null
      window.removeEventListener('mousemove', this.mousemove)
    }
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.setCurrentWidth)
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
    }
  }
}
</style>
