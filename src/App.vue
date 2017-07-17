<template>
  <div id="applicationWrapper">
      <router-view></router-view>
  </div>
</template>

<script>
import 'vuetify/dist/vuetify.min.css'

export default {
  name: 'app',
  mounted() {
    console.log('App mounted')
  }
}
</script>

<style>
  @import './assets/scss/typography.scss';
</style>
