<template>
  <div id="app">
    <img width="100px" alt="logo" src="./assets/git-min.jpeg">
    <default-page msg="基础Vue-Template，赶紧码起来！" />
    <Button @btnClick="toDoc" msg="Your Preset" />
  </div>
</template>

<script>
import Button from './components/Button'
import DefaultPage from './views/index'

export default {
  name: 'App',
  components: {
    Button,
    DefaultPage
  },
  methods: {
    toDoc() {
      let confirmVal = confirm('跳转参考文档页？')
      confirmVal && (window.location.href = 'https://shimo.im/docs/yrVTdy6vkdRGKGyw')
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
img {
  
}
</style>
