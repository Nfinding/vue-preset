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
  button{
    background: linear-gradient(180deg, #FE9947 0%, #FF5333 100%);
    box-shadow: 0px 4px 10px 0px rgba(242, 109, 19, 0.18);
    border-radius: 8px;
    font-size: 18px;
    font-weight: 600;
    color: #FFFFFF;
    text-align: center;
    padding: 8px;
    border: none;
  }
</style>
