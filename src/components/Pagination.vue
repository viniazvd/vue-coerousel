<template>
  <div class="pagination">
    <button
      v-for="page in pagination"
      :key="page"
      :class="setClasses(page)"
      @click="data.position = -((page - 1) * 100)"
    />
  </div>
</template>

<script>
export default {
  name: 'pagination',

  inject: ['childrens', 'perPage', 'data'],

  computed: {
    pagination () {
      return Math.round(this.childrens / this.perPage)
    }
  },

  methods: {
    setClasses (page) {
      return [
        'option', {
          '-active': Math.round(this.data.position / -100) === (page - 1)
        }
      ]
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
    opacity: 0.3;
    margin-right: 15px;
    border-radius: 50%;
    background-color: #121E48;
  }

  & > .-active {
    width: 35px;
    border-radius: 5px;
    background: linear-gradient(135deg, #BC4CF7 0%, #7873EE 100%);
  }
}
</style>
