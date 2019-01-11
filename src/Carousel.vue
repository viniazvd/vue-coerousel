
<template>
  <div class="vue-coerousel">
    clientX: {{ pointer }}

    <button @click="trans -= 100">erick paraiba</button>
    {{ trans }}

    <div class="wrapper">
      <div ref="carousel" class="inner" :style="style">
        <slot></slot>
      </div>
    </div>

    <!-- <slot v-if="false" name="navigation">
      <navigation
        :next="navigationNext"
        :prev="navigationPrev"
        @navigation-click="handleNavigation"
      />
    </slot>

    <slot v-if="paginationEnabled" name="pagination">
      <pagination @paginationclick="goToPage($event, 'pagination')"/>
    </slot> -->
  </div>
</template>
<script>

export default {
  name: 'vue-coe-carousel',

  // components: {
  //   Navigation: () => import('./components/Navigation'),
  //   Pagination: () => import('./components/Pagination')
  // }

  props: {
    perPage: {
      type: [String, Number],
      default: 1
    }
  },

  data () {
    return {
      pointer: null,
      trans: 0
    }
  },

  mounted () {
    this.$children.forEach(c => c.$on('init-pointer', ({ clientX }) => {
      this.pointer = clientX
    }))

    this.$children.forEach(c => c.$on('set-pointer', ({ clientX }) => {
      const slipped = (this.pointer - clientX) / 3

      this.trans -= slipped
      this.pointer = null
    }))
  },

  computed: {
    style () {
      return { transform: `translateX(${this.trans}%)` }
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
      transform: var(--transform);
    }
  }
}
</style>
