import Carousel from './components/Carousel.vue'
import CarouselItem from './components/CarouselItem.vue'

const install = Vue => {
  Vue.component('carousel', Carousel)
  Vue.component('CarouselItem', CarouselItem)
}

export default { install }

export { Carousel, CarouselItem }
