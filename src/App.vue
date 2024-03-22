<script setup>
import titleBar from './components/layout/title-bar.vue'
import toolbar from './components/toolbar.vue'
</script>

<template>
  <div id="layout-div" class="container-fluid">
    <div class="row">
      <div class="col">
        <titleBar></titleBar>
        <toolbar></toolbar>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="content-div">
          <RouterView></RouterView>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
#layout-div {
  padding-left: 0;
  padding-right: 0;
}
.content-div {
  padding-top: 2rem;
  margin-left: 5%;
  margin-right: 5%;
}
</style>
