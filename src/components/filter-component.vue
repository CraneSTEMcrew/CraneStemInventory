<script setup>
import { ref } from 'vue'
import {
  filterOptions,
  availabilityFilter,
  categoryFilter,
  typeFilter
} from '../constants/filterOptions'
import { filterParameters } from '../classes/filter-parameter'
import filterCheckbox from '../components/filter-checkbox.vue'
const emit = defineEmits(['filterUpdated'])
const filterText = ref(null)
const currentFilter = ref([])
const filterParameterObject = ref(new filterParameters())
const staticAvailabilityFilters = JSON.parse(
  JSON.stringify(filterOptions.filter((item) => item.FilterType == availabilityFilter))
)

defineExpose({
  updateFilterText
})

function filterTextUpdated() {
  filterParameterObject.value.filterText = filterText.value
  emit('filterUpdated', filterParameterObject.value)
}
function addToFilterParam() {
  filterParameterObject.value.typeFilter = []
  filterParameterObject.value.subTypeFilter = []
  filterParameterObject.value.categoryFilter = []
  filterParameterObject.value.isAvailable = false

  currentFilter.value.forEach((param) => {
    switch (param.FilterType) {
      case typeFilter:
        filterParameterObject.value.typeFilter.push({
          column: param.filterColumn,
          value: param.filterName
        })

        if (param.subFilters.length > 0) {
          param.subFilters.forEach((subParam) => {
            filterParameterObject.value.subTypeFilter.push({
              column: subParam.filterColumn,
              value: subParam.filterName
            })
          })
        }
        break
      case categoryFilter:
        filterParameterObject.value.categoryFilter.push({
          column: param.filterColumn,
          value: param.filterName
        })
        break
      case availabilityFilter:
        filterParameterObject.value.isAvailable = true
        break
    }
  })
}

function updateFilterText(filterVal) {
  filterText.value = filterVal
}

function filterItemUpdated(filterOption, checkedState, parentOption) {
  let mainOption = undefined
  let parentIdx = parentOption
    ? currentFilter.value.indexOf(parentOption)
    : currentFilter.value.indexOf(filterOption)
  //  let childIdx = undefined
  if (parentOption) {
    mainOption = currentFilter.value[parentIdx]
    if (!mainOption) {
      return
    }
    let childIdx = mainOption.subFilters.indexOf(filterOption)

    if (childIdx >= 0 && !checkedState) {
      mainOption.subFilters.splice(childIdx, 1)
    }
    if (childIdx < 0 && checkedState) {
      mainOption.subFilters.push(filterOption)
    }
  } else {
    if (checkedState) {
      if (parentIdx < 0) {
        //add it
        currentFilter.value.push(filterOption)
      }
    } else {
      if (parentIdx >= 0) {
        //remove it
        currentFilter.value.splice(parentIdx, 1)
      }
    }
  }

  //add to filter param object
  addToFilterParam()
  emit('filterUpdated', filterParameterObject.value)
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
            v-model="filterText"
            @keyup.enter="filterTextUpdated"
          />
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="filterTextUpdated"
            id="filter-button"
          >
            <i id="filter-icon" class="bi bi-search"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="row pt-2">
      <span class="filterType">Availability</span>
      <div class="pt-2 ps-2">
        <div class="form-check" :key="option" v-for="option in staticAvailabilityFilters">
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
