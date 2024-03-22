<script setup>
import filterComponent from '../components/filter.vue'
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">Search Result count</div>
    </div>
    <div class="row">
      <div class="col-3">
        <div class="container-fluid p-0">
          <filterComponent></filterComponent>
        </div>
      </div>
      <div class="col" style="border: solid 1px green">items area</div>
    </div>
  </div>
</template>
