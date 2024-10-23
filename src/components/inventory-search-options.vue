<script setup>
import { ref, onMounted } from 'vue'
import { sortOptions } from '@/constants/filterOptions'
import viewportService from '@/services/viewport-service.js'
import { viewportBreakpoints } from '@/constants/viewport-breakpoints.js'

const emit = defineEmits(['optionsUpdated'])
const props = defineProps(['pageSize', 'pageLayout', 'sortBy'])

const pageSizeConst = ref(null)
const pageLayoutConst = ref(null)
const sortByConst = ref(null)

onMounted(() => {
  pageSizeConst.value = props.pageSize ? props.pageSize : 15
  pageLayoutConst.value = props.pageLayout ? props.pageLayout : 'Grid'
  sortByConst.value = props.sortBy ? props.sortBy : sortOptions[0]
})

function optionsUpdated() {
  emit('optionsUpdated', pageSizeConst.value, pageLayoutConst.value, sortByConst.value)
}
</script>
<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col text-start">
        <div class="row options-row">
          <div
            class="col-xs-12 col-lg-6"
            :class="{ 'text-end': viewportService.determineBreakpoint() > viewportBreakpoints.MD }"
          >
            Page Size
          </div>
          <div class="col">
            <select
              class="form-select form-select-sm mb-3"
              @change="optionsUpdated"
              aria-label="Page Size"
              v-model="pageSizeConst"
            >
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="45">45</option>
              <option value="60">60</option>
            </select>
          </div>
        </div>
      </div>
      <div class="col text-start">
        <div class="row options-row">
          <div
            class="col-xs-12 col-lg-6"
            :class="{ 'text-end': viewportService.determineBreakpoint() > viewportBreakpoints.MD }"
          >
            View
          </div>
          <div class="col">
            <select
              class="form-select form-select-sm"
              @change="optionsUpdated"
              v-model="pageLayoutConst"
              aria-label="results view format"
            >
              <option value="grid">Grid</option>
              <option value="list">List</option>
            </select>
          </div>
        </div>
      </div>
      <div class="col text-start">
        <div class="row options-row">
          <div
            class="col-xs-12 col-lg-6"
            :class="{ 'text-end': viewportService.determineBreakpoint() > viewportBreakpoints.MD }"
          >
            Sort By
          </div>
          <div class="col">
            <select
              class="form-select form-select-sm mb-3"
              @change="optionsUpdated"
              aria-label="results sorted by"
              v-model="sortByConst"
            >
              <option
                :selected="sortBy == option"
                v-for="option in sortOptions"
                :key="option"
                :value="option"
              >
                {{ option.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.options-row {
  @media (max-width: 400px) {
    padding-top: 1rem;
    font-size: 0.81rem;
  }
}
</style>
