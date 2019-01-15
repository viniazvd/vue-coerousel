<template>
  <div class="pagination">
    <button
      v-for="page in pagination"
      :key="page"
      :class="setClasses(page)"
      @click="goToPage(page)"
    />
  </div>
</template>

<script>
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
  }
}
</script>

<style lang="scss">
.pagination {
  display: flex;
  justify-content: center;
  padding-top: 10px;

  & > .option {
    height: 15px;
    width: 10px;
    opacity: 0.3;
    margin-right: 10px;
    border-radius: 50%;
    background-color: #121E48;
  }

  & > .-active {
    width: 35px;
    border-radius: 10px;
    transition-duration: 1s;
    background: linear-gradient(135deg, #BC4CF7 0%, #7873EE 100%);
  }
}
</style>
