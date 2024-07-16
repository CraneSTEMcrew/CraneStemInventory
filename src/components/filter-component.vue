<script setup>
import { ref, onMounted } from 'vue'
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
const currentFilter = ref(JSON.parse(JSON.stringify(filterOptions)))
const filterParameterObject = ref(new filterParameters())

defineExpose({
  updateFilterText,
  updateFilter
})

onMounted(() => {
  currentFilter.value.forEach((item) => {
    item.subFilters.forEach((subItem) => {
      subItem.checked = false
    })
    item.checked = false
  })
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
  let appliedFilters = currentFilter.value.filter((item) => item.checked)
  appliedFilters.forEach((param) => {
    switch (param.filterType) {
      case typeFilter:
        filterParameterObject.value.typeFilter.push({
          column: param.filterColumn,
          value: param.filterName
        })

        if (param.subFilters.length > 0) {
          param.subFilters.forEach((subParam) => {
            if (subParam.checked) {
              filterParameterObject.value.subTypeFilter.push({
                column: subParam.filterColumn,
                value: subParam.filterName
              })
            }
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
        filterParameterObject.value.isAvailable = param.checked
        break
    }
  })
}

function updateFilterText(filterVal) {
  filterText.value = filterVal
}
function updateFilter(filterParam) {
  console.log(filterParam)
  let found = undefined
  let subFound = undefined

  if (filterParam.typeFilter.length > 0) {
    filterParam.typeFilter.forEach((type) => {
      found = currentFilter.value.find(
        (filter) => filter.filterName.toString().toLowerCase() == type.toLowerCase()
      )
      if (found) {
        filterItemUpdated(found, filterParam.subTypeFilter.length == 0)

        if (filterParam.subTypeFilter.length > 0) {
          filterParam.subTypeFilter.forEach((sub) => {
            subFound = found.subFilters.find(
              (subItem) => subItem.filterName.toString().toLowerCase() == sub.toLowerCase()
            )
            if (subFound) {
              filterItemUpdated(subFound)
            }
          })
        }
      }
    })
  }

  if (filterParam.categoryFilter.length > 0) {
    filterParam.categoryFilter.forEach((cat) => {
      found = currentFilter.value.find(
        (filter) => filter.filterName.toString().toLowerCase() == cat.toLowerCase()
      )
      if (found) {
        filterItemUpdated(found)
      }
    })
  }
}

function isFilterChecked(filterOption, isType) {
  let foundFilter = undefined
  if (isType) {
    foundFilter = filterParameterObject.value.typeFilter.find(
      (item) => item.value == filterOption.filterName
    )

    if (foundFilter) return true

    filterParameterObject.value.typeFilter.forEach((item) => {
      if (item.subFilters) {
        foundFilter = item.subFilters.find((subItem) => subItem.value == filterOption.filterName)
        if (foundFilter) return true
      }
    })
  } else {
    foundFilter = filterParameterObject.value.categoryFilter.find(
      (item) => item.value == filterOption.filterName
    )
    return foundFilter
  }
  return false
}
function filterItemUpdated(filterOption, allChildren) {
  if (allChildren == undefined) allChildren = true
  filterOption.checked = !filterOption.checked
  if (filterOption.subFilters && filterOption.subFilters.length > 0) {
    if (filterOption.checked && !allChildren) return
    filterOption.subFilters.forEach((item) => {
      item.checked = filterOption.checked
    })
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
        <div
          class="form-check"
          :key="option"
          v-for="option in currentFilter.filter((item) => item.filterType == availabilityFilter)"
        >
          <filterCheckbox
            :checked="isFilterChecked(option)"
            @filter-updated="filterItemUpdated"
            :option="option"
          ></filterCheckbox>
        </div>
      </div>
      <div class="row pt-2">
        <span class="filterType">Category</span>
        <div class="pt-2 ps-2">
          <div
            class="form-check"
            :key="option"
            v-for="option in currentFilter.filter((item) => item.filterType == categoryFilter)"
          >
            <filterCheckbox
              @filter-updated="filterItemUpdated"
              :checked="option.checked"
              :option="option"
            ></filterCheckbox>
          </div>
        </div>
      </div>
      <div class="row pt-2">
        <span class="filterType">Type</span>
        <div class="pt-2 ps-2">
          <div
            class="form-check"
            :key="option"
            v-for="option in currentFilter.filter((item) => item.filterType == typeFilter)"
          >
            <filterCheckbox
              :checked="option.checked"
              @filter-updated="filterItemUpdated"
              :option="option"
            ></filterCheckbox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
