<script setup>
import { ref, onMounted } from 'vue'
import { sortOptions } from '@/constants/filterOptions'
const emit = defineEmits(['optionsUpdated'])
const props = defineProps(['pageSize', 'pageLayout', 'sortBy'])

const pageSize = ref(null)
const pageLayout = ref(null)
const sortBy = ref(null)

onMounted(() => {
  pageSize.value = props.pageSize ? props.pageSize : 15
  pageLayout.value = props.pageLayout ? props.pageLayout : 'Grid'
  sortBy.value = props.sortBy ? props.sortBy : sortOptions[0]
})

function optionsUpdated() {
  emit('optionsUpdated', pageSize.value, pageLayout.value, sortBy.value)
}
</script>
<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-6"></div>
      <div class="col">
        <div class="row">
          <div class="col-4 text-center">
            <div class="row">
              <div class="col text-end pt-1 pe-1">Per Page</div>
              <div class="col">
                <select
                  class="form-select form-select-sm mb-3"
                  @change="optionsUpdated"
                  aria-label="Page Size"
                  v-model="pageSize"
                >
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                  <option value="60">60</option>
                </select>
              </div>
            </div>
          </div>
          <div class="col-4 p-0 text-center">
            <div class="row">
              <div class="col-5 pe-1 pt-1 text-end">View</div>
              <div class="col">
                <select
                  class="form-select form-select-sm mb-3"
                  @change="optionsUpdated"
                  v-model="pageLayout"
                  aria-label="results view format"
                >
                  <option value="grid">Grid</option>
                  <option value="list">List</option>
                </select>
              </div>
            </div>
          </div>
          <div class="col-4 p-0 text-center">
            <div class="row">
              <div class="col-5 pe-1 pt-1 text-end">Sort By</div>
              <div class="col">
                <select
                  class="form-select form-select-sm mb-3"
                  @change="optionsUpdated"
                  aria-label="results sorted by"
                  v-model="sortBy"
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
    </div>
  </div>
</template>
