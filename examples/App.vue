<template>
  <div id="app" class="s-carousel-example">
    <s-carousel
      controllers
      has-shadow
      :items="items"
      :per-page="2"
      :is-loopable="false"
      :breakpoints="breakpoints"
    >
      <div slot-scope="{ item }" class="ball" :style="{ backgroundColor: item.color }">
        <!-- {{ item }} -->
      </div>
    </s-carousel>
  </div>
</template>

<script>
import SCarousel from './Carousel.vue'

export default {
  name: 'SCarouselExample',

  components: { SCarousel },

  data () {
    return {
      items: [
        { color: 'blue' },
        { color: 'yellow' },
        { color: 'red' },
        { color: 'black' },
        { color: 'pink' },
        // { color: 'turquoise' },
        // { color: 'magenta' },
        // { color: 'white' },
        // { color: 'orange' },
        // { color: 'green' },
        // { color: 'purple' },
        // { color: 'cyan' },
        // { color: 'lime' },
        // { color: 'lightblue' }
      ],
      breakpoints: {
        1024: { perPage: 4 },
        768: { perPage: 3 },
        640: { perPage: 2 },
        320: { perPage: 1 }
      }
    }
  }
}
</script>

<style lang="scss">
.s-carousel-example {
  padding: 100px;

  & > .s-carousel {
    width: 90%;
    margin-left: 40px;

    & > .wrapper {
      & > .inner {
        // -webkit-transition: all .4s cubic-bezier(0.47, 0, 0.745, 0.715);
        // transition:         all .4s cubic-bezier(0.47, 0, 0.745, 0.715);
        & > .carousel-item {
          & > .ball {
            width: 200px;
            height: 200px;
            margin: 0 auto;
            border-radius: 50%;
          }
        }
      }
    }
  }
}
</style>
