<script>

// <template>
//   <div class="vue-coerousel">
//     position: {{ position }}

//     <div class="wrapper">
//       <div class="inner" :style="style" @mousedown="mousedown">
//         <slot></slot>
//       </div>
//     </div>

//     <pagination v-if="pagination" />
//   </div>
// </template>

import Pagination from './components/Pagination.vue'

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
    },
    friction: {
      type: Number,
      default: 0.9
    },
    centerAfterDragging: Boolean
  },

  data () {
    return {
      initPosition: 0,
      position: 0,
      currentWidth: 0,

      acceleration: 0.7,
      inertia: false
    }
  },

  provide () {
    const options = {}

    const define = (name, get) => Object.defineProperty(options, name, { get, enumerable: true })

    define('children', () => this.$children.length - 1)
    define('data', () => this)

    return options
  },

  mounted () {
    this.startAnimation()

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
    fixPosition () {
      const position = this.position / this.itemSize

      const isCenter = !String(position).split('').includes('.')

      if (!isCenter && this.position >= this.endPosition) this.position = (Math.round(this.position / this.itemSize) * 100) / this.internalPerPage
    },

    getAcceleration () {
      const time = 1000
      const v1 = this.position - this.initPosition
      const delta = Math.sign(v1) === -1 ? v1 * (- 1) : v1

      return delta / time
    },

    startAnimation () {
      requestAnimationFrame(this.startAnimation)

      if (this.inertia) {
        this.acceleration = this.getAcceleration()
      } else {
        this.position += this.acceleration
        this.acceleration *= this.friction
      }

      if (this.position > 0) this.position = 0
      if (this.position < this.endPosition) this.position = this.endPosition
    },

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
    },

    mousedown ({ clientX }) {
      if (!this.isDraggable) return false

      this.inertia = true
      this.initPosition = ~~(clientX / 10) - this.position

      window.addEventListener('mousemove', this.mousemove)
      window.addEventListener('mouseup', this.mouseup)
    },

    mouseup ({ clientX }) { // touchend ?
      if (!this.isDraggable) return false
      if (this.centerAfterDragging) this.fixPosition()

      this.inertia = false

      window.removeEventListener('mousemove', this.mousemove)
    }
  },

  render (h) {
    const inner = h('div', { staticClass: 'inner', ref: 'inner', style: this.style, on: { mousedown: this.mousedown } }, this.$slots.default)

    const wrapper = h('div', { staticClass: 'wrapper', ref: 'wrapper' }, [ inner ])

    const pagination = this.pagination && h(Pagination)

    return h('div', { staticClass: 'vue-coerousel' }, [ [ h('span', null, `position: ${this.position}`) ], wrapper, pagination ])
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
