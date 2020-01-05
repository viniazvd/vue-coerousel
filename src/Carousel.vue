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

import { setEvents, setProvide } from './services'

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
      default: 0.97
    },
    centerAfterDragging: Boolean
  },

  data () {
    return {
      initPosition: 0,
      currentWidth: 0,
      events: {},
      dragging: false,
      mouse: { x: 0, y: 0 },
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      previous: { x: 0, y: 0 }
    }
  },

  provide () {
    return setProvide([
      { name: 'data', get: this },
      { name: 'children', get: this.$children.length - 1 }
    ])
  },

  mounted () {
    this.events = setEvents

    this.isLoopable && this.initLoop()

    this.hasBreakpoints && this.setCurrentWidth({ target: { innerWidth: document.body.clientWidth } })

    window.addEventListener('resize', this.setCurrentWidth)
    this.step()
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
      const position = ~~this.position.x * (- 1)

      return Math.ceil(position.x / 100) + 1
    },

    containerWidth () {
      if (!this.$refs['inner']) return 0

      return ~~(this.$refs['inner'].clientWidth / 100)
    },

    style () {
      return { transform: `translateX(${this.position.x}%)` }
    }
  },

  methods: {
    fixPosition () {
      const position = this.position.x / this.itemSize

      const isCenter = !String(position).split('').includes('.')

      if (!isCenter && this.position.x >= this.endPosition.x) this.position.x = (Math.round(this.position.x / this.itemSize) * 100) / this.internalPerPage
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

    step() {
      requestAnimationFrame(this.step)

      const FRICTION_COEFF = 0.85

      if (this.dragging) {
        this.previous.x = this.position.x
        // this.previous.y = this.position.y

        this.position.x = this.mouse.x
        // this.position.y = this.mouse.y

        this.velocity.x = (this.position.x - this.previous.x)
        // this.velocity.y = (this.position.y - this.previous.y)
        console.log('1')
      } else {
        this.position.x += this.velocity.x
        // this.position.y += this.velocity.y

        this.velocity.x *= FRICTION_COEFF
        // this.velocity.y *= FRICTION_COEFF
        console.log('2')
      }

      if (this.position.x > 0) this.position.x = 0
      if (this.position.x < this.endPosition) this.position.x = this.endPosition
    },

    mousemove (e) {
      console.log('move')
      const x = this.getX(e)

      const slipped = ~~((x / this.containerWidth) - this.initPosition)
      console.log({ slipped })

      this.mouse.x = slipped
    },

    mousedown (e) {
      console.log('down')
      // if (!this.dragging) return false
      this.dragging = true

      const x = this.getX(e)

      this.initPosition = ~~(x / this.containerWidth) - this.mouse.x

      window.addEventListener(this.events['move'], this.mousemove)
      window.addEventListener(this.events['end'], this.mouseup)
    },

    mouseup (e) {
      console.log('up')
      this.dragging = false
      // this.mouse.x = 0
      // if (!this.isDraggable) return false
      if (this.centerAfterDragging) this.fixPosition()

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

    return h('div', { staticClass: 'vue-coerousel' }, [
      [ h('span', null, `position: ${this.position.x} - previous: ${this.previous.x} - mouse ${this.mouse.x}-velocity ${this.velocity.x}`) ]
      , wrapper, pagination ])
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
      // transition: transform .3s;
      // -webkit-transition: all 600ms cubic-bezier(0.47, 0, 0.745, 0.715);
      // transition:         all 600ms cubic-bezier(0.47, 0, 0.745, 0.715);
    }
  }
}
</style>
