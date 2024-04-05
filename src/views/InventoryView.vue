<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import filterComponent from '../components/filter.vue'
import inventorySearchResult from '../components/inventory-search-result.vue'
import pager from '../components/pager.vue'
import InventorySearchOptions from '../components/inventory-search-options.vue'
import googleSheetsService from '../services/google-sheets-service'
import { sortOptions } from '@/constants/filterOptions'
import { filterParameters } from '../classes/filter-parameter'
const sheetID = '1V3SJog_ZNjtaEg2k2BJ_6if7cDcCuneS1tWH7cf1e-0'
const dataResult = ref([])
const totalResults = ref(0)
const filterParameterObject = ref(new filterParameters())
const pageLayout = ref('grid')
const totalPages = ref(0)
const pageSize = ref(15)
const isGrid = ref(true)
const sortBy = ref(sortOptions[0])
const currentPage = ref(1)
const svc = new googleSheetsService(sheetID)
const topFilter = ref(null)
const route = useRoute()
const currentRoute = ref(null)

onMounted(async () => {
  currentRoute.value = route.fullPath
  topFilter.value = route.params.filter
  await fetchInventoryData()
})

watch(
  route,
  () => {
    if (currentRoute.value && route.fullPath != currentRoute.value) {
      currentRoute.value = route.fullPath
      topFilter.value = route.params.filter
      if (topFilter.value.replace('$all', '').length == 0) {
        filterParameterObject.value.filterText = ''
      }
      fetchInventoryData()
      console.log('refersh')
    }
  },
  { deep: true, immediate: true }
)

function generateQuery() {
  let filterQuery = ''

  if (topFilter.value && topFilter.value.replace('$all$', '').length > 0) {
    filterQuery = `LOWER(C) LIKE '%${topFilter.value.toLowerCase()}%'`
  }

  if (filterParameterObject.value.filterText.length > 0) {
    filterQuery =
      filterQuery.length > 0
        ? `${filterQuery} AND LOWER(C) LIKE '%${filterParameterObject.value.filterText.toLowerCase()}%'`
        : `LOWER(C) LIKE '%${filterParameterObject.value.filterText.toLowerCase()}%'`
  }
  if (filterParameterObject.value.isAvailable) {
    filterQuery = filterQuery ? ` AND F > 0 ` : ' F > 0'
  }

  //category filters
  if (filterParameterObject.value.categoryFilter.length > 0) {
    let catQueryCount = 0
    let catQuery = '' //filterParameterObject.value.categoryFilter.length > 1 ? '(': ''
    filterQuery += filterQuery ? ` AND ` : ' '

    filterParameterObject.value.categoryFilter.forEach((cat) => {
      catQuery +=
        catQueryCount > 0
          ? ' OR ' + `LOWER(${cat.column}) Like '%${cat.value.toLowerCase()}%'`
          : `LOWER(${cat.column}) Like '%${cat.value.toLowerCase()}%'`
      catQueryCount += 1
    })
    if (catQueryCount > 1) {
      catQuery = `(${catQuery})`
    }
    filterQuery += catQuery
  }

  //type filters
  if (filterParameterObject.value.typeFilter.length > 0) {
    let typeQueryCount = 0
    let typeQuery = ''
    filterQuery += filterQuery ? ` AND ` : ' '

    filterParameterObject.value.typeFilter.forEach((type) => {
      typeQuery +=
        typeQueryCount > 0
          ? ' OR ' + `LOWER(${type.column}) Like '%${type.value.toLowerCase()}%'`
          : `LOWER(${type.column}) Like '%${type.value.toLowerCase()}%'`
      typeQueryCount += 1
    })
    if (typeQueryCount > 1) {
      typeQuery = `(${typeQuery})`
    }

    filterQuery += typeQuery
  }

  //subType filter
  if (filterParameterObject.value.subTypeFilter.length > 0) {
    let subTypeQueryCount = 0
    let subTypeQuery = ''
    filterQuery += filterQuery ? ` AND ` : ' '

    filterParameterObject.value.subTypeFilter.forEach((subType) => {
      subTypeQuery +=
        subTypeQueryCount > 0
          ? ' OR ' + `LOWER(${subType.column}) Like '%${subType.value.toLowerCase()}%'`
          : `LOWER(${subType.column}) Like '%${subType.value.toLowerCase()}%'`
      subTypeQueryCount += 1
    })
    if (subTypeQueryCount > 1) {
      subTypeQuery = `(${subTypeQuery})`
    }

    filterQuery += subTypeQuery
  }

  if (filterQuery.length > 0) {
    filterQuery = ` WHERE ${filterQuery}`
  }
  console.log(filterQuery)
  return filterQuery.length > 0 ? filterQuery : undefined
}

function fetchInventoryData() {
  let query = 'SELECT *'
  let filterQuery = generateQuery()

  svc.getSheetTotal('inventory', filterQuery).then((count) => {
    //currentPage.value = 1
    //pageSize.value = 15
    totalResults.value = count
    totalPages.value = calculateTotalPages(count, pageSize.value)
    if (totalResults.value == 0) {
      dataResult.value = []
      return
    }

    svc
      .GetSheetData(
        'inventory',
        query + (filterQuery ? filterQuery : ''),
        pageSize.value,
        currentPage.value,
        sortBy.value,
        filterParameterObject.value
      )
      .then((result) => {
        dataResult.value = result
      })
  })
}

function currentPageUpdated(newPageNumber) {
  currentPage.value = newPageNumber
  fetchInventoryData()
}
function calculateTotalPages(total, pagesize) {
  return Math.ceil(total / pagesize)
}
function optionsUpdated(size, layout, sort) {
  if (size != pageSize.value || sort != sortBy.value) {
    sortBy.value = sort
    pageSize.value = size
    totalPages.value = calculateTotalPages(totalResults.value, pageSize.value)
    fetchInventoryData()
  }

  pageLayout.value = layout
  isGrid.value = pageLayout.value == 'Grid'
}
function filterUpdate(param) {
  currentPage.value = 1
  filterParameterObject.value = param
  fetchInventoryData()
}
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-3">
        <div class="row">
          <div class="col-4">
            <span class="fs-4">ALL ITEMS</span>
          </div>
          <div class="col pt-2 text-start">
            <span class="fs-6 text-start"
              >{{ totalResults }} {{ totalResults == 1 ? 'result' : 'results' }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-3">
        <div class="container-fluid p-0">
          <filterComponent @filterUpdated="filterUpdate"></filterComponent>
        </div>
      </div>
      <div class="col">
        <div class="row">
          <div class="col">
            <InventorySearchOptions
              :page-size="pageSize"
              :page-layout="pageLayout"
              :sort-by="sortBy"
              @options-updated="optionsUpdated"
            ></InventorySearchOptions>
          </div>
        </div>
        <div class="row gy-3" v-if="dataResult.length > 0">
          <inventorySearchResult
            v-for="item in dataResult"
            :key="item"
            :is-grid="pageLayout == 'grid'"
            :data="item"
          ></inventorySearchResult>
        </div>
        <div class="row gy-3" v-if="dataResult.length == 0">No Results found</div>
        <div class="row text-center">
          <div class="col text-center">
            <pager
              @page-updated="currentPageUpdated"
              :current-page="currentPage"
              :page-total="totalPages"
            ></pager>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
