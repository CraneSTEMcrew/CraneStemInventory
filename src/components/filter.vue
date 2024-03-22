<script setup>
import { ref } from 'vue'
import {
  filterOptions,
  availabilityFilter,
  categoryFilter,
  typeFilter
} from '../constants/filterOptions'
import filterCheckbox from '../components/filter-checkbox.vue'

const currentFilter = ref([])

function filterItemUpdated(filterName, checkedState) {
  console.log(currentFilter)
  let idx = currentFilter.value.indexOf(filterName)

  if (idx < 0 && checkedState) {
    console.log(`adding ${filterName}`)

    currentFilter.value.push(filterName)
    //  console.log(currentFilters)
    return
  }

  if (idx >= 0 && !checkedState) {
    currentFilter.value.splice(idx, 1)
  }
}
</script>

<template>
  <div class="p-0">
    <div class="row pt-2">
      <div class="col"><img src="../assets/NSWCCraneLogo.jpg" /><br /></div>
    </div>
    <div class="row pt-4">
      <div class="col text-start">
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Search Within.."
            aria-label="Search"
          />
          <button class="btn btn-outline-secondary" type="button" id="filter-button">
            <i id="filter-icon" class="bi bi-search"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="row pt-2">
      <span class="filterType">Availability</span>
      <div class="pt-2 ps-2">
        <div
          class="form-check"
          :key="option"
          v-for="option in filterOptions.filter((item) => item.FilterType == availabilityFilter)"
        >
          <filterCheckbox @filter-updated="filterItemUpdated" :option="option"></filterCheckbox>
        </div>
      </div>
      <div class="row pt-2">
        <span class="filterType">Category</span>
        <div class="pt-2 ps-2">
          <div
            class="form-check"
            :key="option"
            v-for="option in filterOptions.filter((item) => item.FilterType == categoryFilter)"
          >
            <filterCheckbox @filter-updated="filterItemUpdated" :option="option"></filterCheckbox>
          </div>
        </div>
      </div>
      <div class="row pt-2">
        <span class="filterType">Type</span>
        <div class="pt-2 ps-2">
          <div
            class="form-check"
            :key="option"
            v-for="option in filterOptions.filter((item) => item.FilterType == typeFilter)"
          >
            <filterCheckbox @filter-updated="filterItemUpdated" :option="option"></filterCheckbox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
