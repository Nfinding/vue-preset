<template>
  <section class="Button">
    <button @click="() => { this.$emit('btnClick') }">{{ msg }}</button>
  </section>
</template>

<script>
export default {
 name: 'Button',
  components: {},
  props: {
    msg: {
      type: String,
      default: 'Click Me'
    }
  },
}
</script>

<style lang="scss" scoped>
  .Button {
    border: none;
    font-size: 18px;
    font-weight: 600;
  }
</style>
