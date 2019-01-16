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
  name: 'pagination',

  inject: ['childrens', 'data'],

  computed: {
    pagination () {
      return Math.ceil(this.childrens / this.data.internalPerPage)
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
      const remainder = this.childrens % this.data.internalPerPage
      const diff = (this.pagination === page && remainder && (this.data.internalPerPage - remainder) * this.data.itemSize) || 0

      this.data.position = -(((page - 1) * 100) - diff)
    }
  },

  render (h) {
    const button = Array
      .from({ length: this.pagination }, (_, index) => index + 1)
      .map(page => {
        return h('button', {
          key: page,
          class: this.setClasses(page),
          on: { click: () => this.goToPage(page) }
        })
      })

    return h('div', { staticClass: 'pagination' }, [ button ])
  }
}
</script>

<style lang="scss">
.pagination {
  display: flex;
  padding-top: 10px;
  justify-content: center;

  & > .option {
    position: relative;
    width: 10px;
    height: 15px;
    opacity: 0.3;
    outline: none;
    margin-right: 10px;
    border-radius: 50%;
    background-color: #121E48;
  }

  & > .-active {
    width: 35px;
    border-radius: 10px;
    transition-duration: 1s;
    opacity: 1;
    background: linear-gradient(135deg, #BC4CF7 0%, #7873EE 100%);

    &:before {
      position: absolute;
      content: '';
      left: -1px;
      top: 0;
      width: 10px;
      height: 13px;
      outline: none;
      border-radius: 50%;
      background-color: white;
      transition-duration: 0.7s;
      transition-delay: 0.1s;
      transform: translateX(0%);
      // transform: translateX(250%);
      transition-timing-function: ease-in;
    }
  }
}
</style>
