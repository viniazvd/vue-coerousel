
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
  name: 'vue-coe-carousel',

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
    }
  },

  data () {
    return {
      initPosition: null,
      position: 0
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
  },

  computed: {
    itemSize () {
      return 100 / this.perPage
    },

    endPosition () {
      const itemsNum = this.$children.length

      return -(this.itemSize * itemsNum) + (100 + this.itemSize)
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

      if (!isCenter && this.position >= this.endPosition) this.position = (Math.round(this.position / this.itemSize) * 100) / this.perPage

      this.initPosition = null
      window.removeEventListener('mousemove', this.mousemove)
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
    }
  }
}
</style>
