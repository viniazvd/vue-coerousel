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

import Pagination from './Pagination.vue'

import { isMobile } from '../services'

export default {
  name: 'Carousel',

  components: { Pagination },

  props: {
    pagination: {
      type: Boolean,
      default: true
    },
    controllers: {
      type: Boolean,
      default: false
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
      default: 0.97
    },
    centerAfterDragging: Boolean
  },

  data () {
    return {
      initPosition: 0,
      position: 0,
      currentWidth: 0,
      isDragging: false,
      // velocity: 0,
      // inertia: false,
      // startTime: 0,
      // endTime: 0,
      events: {}
    }
  },

  provide () {
    const options = {}

    const define = (name, get) => Object.defineProperty(options, name, { get, enumerable: true })

    define('data', () => this)
    define('items', () => this.itemQtd)

    return options
  },

  mounted () {
    this.events = {
      'start': isMobile() ? 'touchstart' : 'mousedown',
      'move': isMobile() ? 'touchmove' : 'mousemove',
      'end': isMobile() ? 'touchend' : 'mouseup'
    }

    this.isLoopable && this.initLoop()

    this.hasBreakpoints && this.setCurrentWidth({ target: { innerWidth: document.body.clientWidth } })

    window.addEventListener('resize', this.setCurrentWidth)
  },

  computed: {
    itemSize () {
      return 100 / this.internalPerPage
    },

    itemQtd () {
      return this.$slots.default
        .filter(({ componentOptions }) => componentOptions && componentOptions.tag === 'coerousel-item').length
    },

    totalPages () {
      return Math.round(this.itemQtd / this.internalPerPage) || 0
    },

    endPosition () {
      const itemsNum = this.$slots.default
        .filter(({ componentOptions }) => componentOptions && componentOptions.tag === 'coerousel-item').length + 1

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

    containerWidth () {
      if (!this.$refs['inner']) return 0

      return ~~(this.$refs['inner'].clientWidth / 100)
    },

    carouselClasses () {
      const isFirstPage = this.currentPage === 1

      return ['vue-coerousel',
        {
          '--has-controllers': this.controllers,
          '--is-first-page': this.itemQtd > 1 && isFirstPage,
          '--is-last-page': !isFirstPage && this.currentPage === this.totalPages
        }
      ]
    },

    style () {
      return {
        transform: `translateX(${this.position}%)`,
        cursor: this.isDragging ? 'pointer' : 'initial'
      }
    }
  },

  methods: {
    fixPosition () {
      const position = this.position / this.itemSize

      const isCenter = !String(position).split('').includes('.')

      if (!isCenter && this.position >= this.endPosition) this.position = (Math.round(this.position / this.itemSize) * 100) / this.internalPerPage
    },

    // getVelocity () {
    //   const time = -~~(this.startTime - this.endTime)
    //   const v1 = this.initPosition - this.position
    //   const delta = Math.sign(v1) === -1 ? v1 * (- 1) : v1

    //   return Math.abs(delta / time)
    // },

    // startAnimation () {
    //   this.velocity = this.getVelocity()

    //   if (this.inertia) {
    //     this.position += this.velocity
    //     this.velocity *= this.friction

    //     if (this.position > 0) this.position = 0
    //     if (this.position < this.endPosition) this.position = this.endPosition

    //     requestAnimationFrame(this.startAnimation)
    //   } else {
    //     return false
    //   }
    // },

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

    next () {
      if (this.position < (this.endPosition + 100)) return this.position = this.endPosition

      this.position -= 100
    },

    previous () {
      if (this.position > -100) return this.position = 0

      this.position += 100
    },

    mousemove (e) {
      this.isDragging = true
      const x = this.getX(e)

      const slipped = ~~((x / this.containerWidth) - this.initPosition)

      this.position = slipped

      if (this.position > 0) this.position = 0
      if (this.position < this.endPosition) this.position = this.endPosition
    },

    mousedown (e) {
      if (!this.isDraggable) return false
      this.isDragging = true

      const x = this.getX(e)

      // this.inertia = true
      // this.startTime = new Date().getTime() // e.timeStamp

      this.initPosition = ~~(x / this.containerWidth) - this.position

      window.addEventListener(this.events['move'], this.mousemove)
      window.addEventListener(this.events['end'], this.mouseup)
    },

    mouseup (e) {
      if (!this.isDraggable) return false
      if (this.centerAfterDragging) this.fixPosition()
      this.isDragging = false

      // this.endTime = new Date().getTime() // e.timeStamp

      // this.startAnimation()

      // setTimeout(() => { this.inertia = false }, 1000)

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


    const next = h('div', { staticClass: 'controller next', on: { click: this.next } }, this.$slots.next)
    const previous = h('div', { staticClass: 'controller previous', on: { click: this.previous } }, this.$slots.previous)

    const wrapper = h('div', { staticClass: 'wrapper', ref: 'wrapper' }, [ inner ])

    const pagination = this.pagination && h(Pagination, {
      props: { totalPages: this.totalPages }
    })

    return h('div',
      { class: this.carouselClasses },
      [
        // [ h('span', `position: ${this.position}`) ],
        this.controllers ? previous : false,
        wrapper,
        this.controllers ? next : false,
        pagination
      ]
    )
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.setCurrentWidth)
  }
}
</script>

<style lang="scss">
.vue-coerousel {
  position: relative;

  & > .controller {
    z-index: 1;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid black;

    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  & > .previous { left: 10px; }
  & > .next { right: 10px; }

  & > .wrapper {
    overflow: hidden;

    & > .inner {
      display: flex;
      transition: transform .3s;
      // -webkit-transition: all 600ms cubic-bezier(0.47, 0, 0.745, 0.715);
      // transition:         all 600ms cubic-bezier(0.47, 0, 0.745, 0.715);
    }
  }
}
</style>
