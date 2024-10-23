<script setup>
import titleBar from './components/layout/title-bar.vue'
import toolbar from './components/toolbar-component.vue'
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
  padding-top: 1rem;
  margin-left: 1rem;
  margin-right: 1rem;
  @media (max-width: 768px) {
    margin-left: 0.1rem;
    margin-right: 0.1rem;
    padding-top: 0.1rem;
  }
}
</style>
