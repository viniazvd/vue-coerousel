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
    hasShadow: Boolean,
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
      events: {},
      leftShadow: false,
      rightShadow: false
    }
  },

  provide () {
    const options = {}

    const define = (name, get) => Object.defineProperty(options, name, { get, enumerable: true })

    define('data', () => this)
    define('items', () => this.itemQtd)

    return options
  },

  watch: {
    position: {
      immediate: true,
      handler: 'setShadows'
    }
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
      return Math.ceil(this.itemQtd / this.internalPerPage) || 0
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
      const showController = this.itemQtd > this.internalPerPage

      return ['vue-coerousel',
        {
          '--has-controllers': this.controllers,
          '--is-left-shadow': this.hasShadow && this.leftShadow,
          '--is-right-shadow': this.hasShadow && this.rightShadow,
          '--has-previous': showController && this.position < 0,
          '--has-next': showController && this.position > this.endPosition
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
    setShadows (position) {
      this.leftShadow = this.hasShadow && position !== 0
      this.rightShadow = this.hasShadow && position !== this.endPosition
    },

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
$shadow-color1: rgba(243, 244, 246, 0);
$shadow-color2: #F3F4F6;

%shadow {
  opacity: 0;
  content: "";
  z-index: 10;
  position: absolute;
  pointer-events: none;
  transition: opacity .5s ease-in-out;
}

.vue-coerousel {
  position: relative;

  &.--is-left-shadow > .wrapper {
    &::before {
      opacity: 1;
      width: 30px;
      height: 100%;
      background: linear-gradient(to left, $shadow-color1 0%, $shadow-color2 70%);
    }
  }

  &.--is-right-shadow > .wrapper {
    &::after {
      opacity: 1;
      top: 0;
      right: 0;
      width: 30px;
      height: 100%;
      background: linear-gradient(to right, $shadow-color1 0%, $shadow-color2 70%);
    }
  }

  & > .controller {
    z-index: 1;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid black;

    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    &.next { display: none; }
    &.previous { display: none; }
  }

  & > .wrapper {
    overflow: hidden;
    position: relative;

    &::after { transform: scaleY(-1); }
    &::before, &::after { @extend %shadow; }

    & > .inner {
      display: flex;
      transition: transform .3s;
      // -webkit-transition: all 600ms cubic-bezier(0.47, 0, 0.745, 0.715);
      // transition:         all 600ms cubic-bezier(0.47, 0, 0.745, 0.715);
    }
  }

  &.--has-controllers {
    & > .next { right: -60px; }
    & > .previous { left: -60px; }
  }

  &.--has-next > .next { display: block; }
  &.--has-previous > .previous { display: block; }
}
</style>
