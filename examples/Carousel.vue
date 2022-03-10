<template>
  <coerousel class="s-carousel" v-bind="$attrs">
    <div slot="previous" class="previous" icon="sdz-chevron-left" size="15" />

    <coerousel-item v-for="(item, index) in items" :key="index">
      <slot :item="item" />
    </coerousel-item>

    <div slot="next" class="next" icon="sdz-chevron-right" size="15" />
  </coerousel>
</template>

<script>
// import 'vue-coerousel/dist/vue-coerousel.css'
import Carousel from '../src/components/Carousel.vue'
import CarouselItem from '../src/components/CarouselItem.vue'

// import SIcon from '../SIcon/Index.vue'

export default {
  name: 'SCarousel',

  components: {
    // SIcon,
    'coerousel': Carousel,
    'coerousel-item': CarouselItem
  },

  props: {
    items: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss">
.s-carousel {
  & > .controller {
    cursor: pointer;
    background: #FFFFFF;

    & > .previous {
      position: absolute;
      top: 49%;
      left: 13px;
      transform: translateY(-50%);
      font-size: 20px !important;
    }

    & > .next {
      position: absolute;
      top: 49%;
      right: 13px;
      transform: translateY(-50%);
      font-size: 20px !important;
    }
  }

  & > .previous {
    left: -60px;
  }
  & > .next {
    right: -60px;
  }


  & > .wrapper { background: transparent; }
}
</style>
