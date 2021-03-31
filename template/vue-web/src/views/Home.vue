<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <%_ if (!rootOptions.bare) { _%>
    <Button msg="构建自己的vue模版"/>
    <%_ } else { _%>
    <h1>Vue-Template已搭建完成，赶紧码起来！</h1>
    <%_ } _%>
  </div>
</template>
<%_ if (!rootOptions.bare) { _%>

<script>
// @ is an alias to /src
import Button from '@/components/Buttons.vue'
export default {
  name: 'Home',
  components: {
    Button
  }
}
</script>
<%_ } _%>
