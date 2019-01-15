<template>
  <div id="app">
    <carousel :per-page="3" :is-loopable="false" :breakpoints="breakpoints">
      <carousel-item v-for="(option, index) in options" :key="index">
        <div class="ball" :style="{ backgroundColor: option.color }" />
      </carousel-item>
    </carousel>
  </div>
</template>

<script>
import Carousel from './Carousel.vue'
import CarouselItem from './components/CarouselItem.vue'

export default {
  name: 'app',

  components: { Carousel, CarouselItem },

  data () {
    return {
      options: [
        { color: 'blue' },
        { color: 'yellow' },
        { color: 'red' },
        { color: 'black' },
        { color: 'pink' },
        { color: 'turquoise' },
        { color: 'magenta' },
        { color: 'white' },
        { color: 'orange' },
        { color: 'green' },
        { color: 'purple' },
        { color: 'cyan' },
        { color: 'lime' },
        { color: 'lightblue' }
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
// #app {
//   max-width: 900px;
//   margin: 0 auto;
// }

.ball {
  width: 300px;
  height: 300px;
  margin: 0 auto;
  border-radius: 50%;
}
</style>
