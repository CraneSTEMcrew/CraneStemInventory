<script setup>
import { ref, onMounted } from 'vue'
import { sortOptions } from '@/constants/filterOptions'
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
      <div class="col col-lg-8 col-xl-6 p-0 offset-lg-4 offset-xl-6">
        <div class="row p-0">
          <div class="col-4">
            <div class="row">
              <div class="col text-end pt-1 pe-0">Per Page</div>
              <div class="col text-end pe-0">
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
          <div class="col-4 p-0 text-end">
            <div class="row">
              <div class="col-5 pe-1 pt-1 text-end">View</div>
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
          <div class="col-4 p-0 text-end">
            <div class="row">
              <div class="col-5 pe-1 pt-1 text-end">Sort By</div>
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
    </div>
  </div>
</template>
