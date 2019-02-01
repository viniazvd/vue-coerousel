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
      default: 0.95
    },
    centerAfterDragging: Boolean
  },

  data () {
    return {
      initPosition: 0,
      position: 0,
      currentWidth: 0,
      acceleration: 0,
      inertia: false,
      events: {}
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
    this.events = {
      'start': this.isMobile() ? 'touchstart' : 'mousedown',
      'move': this.isMobile() ? 'touchmove' : 'mousemove',
      'end': this.isMobile() ? 'touchend' : 'mouseup'
    }

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

    currentPage () {
      const position = ~~this.position * (- 1)

      return Math.ceil(position / 100) + 1
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
      // console.log(this.currentPage * 100)
      const v1 = this.position - this.initPosition
      // console.log('v1', v1)
      const delta = Math.sign(v1) === -1 ? v1 * (- 1) : v1

      return delta / time
    },

    isMobile () {
      return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp2|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    },

    startAnimation () {
      if (this.inertia) {
        this.position += this.acceleration
        this.acceleration *= this.friction

        // if (this.position > 0) this.position = 0
        // if (this.position < this.endPosition) this.position = this.endPosition

        requestAnimationFrame(this.startAnimation)
      }
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

    getX (e) {
      return (e.changedTouches && e.changedTouches[0] && e.changedTouches[0].clientX) || e.clientX
    },

    mousemove (e) {
      const x = this.getX(e)

      const containerWidth = ~~(this.$refs['inner'].clientWidth / 100)

      const slipped = ~~((x / containerWidth) - this.initPosition)

      this.position = slipped

      if (this.position > 0) this.position = 0
      if (this.position < this.endPosition) this.position = this.endPosition
    },

    mousedown (e) {
      if (!this.isDraggable) return false

      // console.log(e.timeStamp)

      const containerWidth = ~~(this.$refs['inner'].clientWidth / 100)

      const x = this.getX(e)

      this.inertia = true
      this.initPosition = ~~(x / containerWidth) - this.position

      window.addEventListener(this.events['move'], this.mousemove)
      window.addEventListener(this.events['end'], this.mouseup)
    },

    mouseup () {
      if (!this.isDraggable) return false
      if (this.centerAfterDragging) this.fixPosition()

      // this.acceleration = 0.7
      // this.startAnimation()

      // setTimeout(() => { this.inertia = false }, 2000)

      window.removeEventListener(this.events['move'], this.mousemove)
    }
  },

  render (h) {
    const inner = h('div', {
      staticClass: 'inner',
      ref: 'inner',
      style: this.style,
      on: {
        [this.events['start']]: this.mousedown
      }
    }, this.$slots.default)

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
