<script>

// <template>
//   <div class="pagination">
//     <button
//       v-for="page in pagination"
//       :key="page"
//       :class="setClasses(page)"
//       @click="goToPage(page)"
//     />
//   </div>
// </template>

export default {
  name: 'Pagination',

  inject: ['items', 'data'],

  props: { totalPages: Number },

  computed: {
    containerWidth () {
      const pagination = this.totalPages - 1

      return { '--width': ((pagination * 10) + (pagination * 5) + 35) + 'px' }
    }
  },

  methods: {
    setClasses (page) {
      return [
        'option', {
          '-active': Math.round(this.data.position / -100) === (page - 1)
        }
      ]
    },

    goToPage (page) {
      const remainder = this.items % this.data.internalPerPage
      const diff = (this.totalPages === page && remainder && (this.data.internalPerPage - remainder) * this.data.itemSize) || 0

      this.data.position = -(((page - 1) * 100) - diff)
    }
  },

  render (h) {
    const button = Array
      .from({ length: this.totalPages }, (_, index) => index + 1)
      .map(page => {
        return h('div', {
          key: page,
          class: this.setClasses(page),
          on: { click: () => this.goToPage(page) }
        })
      })

    return h('div', { style: this.containerWidth, staticClass: 'pagination' }, [ button ])
  }
}
</script>

<style lang="scss">
.pagination {
  display: flex;
  margin: 0 auto;
  padding-top: 10px;
  width: var(--width);
  justify-content: space-between;

  & > .option {
    position: relative;
    width: 10px;
    height: 10px;
    opacity: 0.3;
    outline: none;
    border-radius: 5px;
    background-color: #121E48;
    transition: width .3s linear;
  }

  & > .-active {
    opacity: 1;
    width: 35px;
    background: linear-gradient(135deg, #BC4CF7 0%, #7873EE 100%);
  }
}
</style>
