<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import contactDetail from '../components/contact-detail.vue'
import googleSheetsService from '@/services/google-sheets-service.js'
import 'v-calendar/style.css'
import { Calendar } from 'v-calendar'

const sheetID = '1V3SJog_ZNjtaEg2k2BJ_6if7cDcCuneS1tWH7cf1e-0' //move to constants
const props = defineProps(['id'])
const inventoryItem = ref(null)
const svc = new googleSheetsService(sheetID)
const route = useRoute()
const currentRoute = ref(null)
const scheduledDates = ref([])

onMounted(() => {
  currentRoute.value = route.fullPath
  if (props.id) {
    loadInventoryDetails(props.id)
  }
})
watch(
  route,
  () => {
    if (currentRoute.value && route.fullPath !== currentRoute.value) {
      currentRoute.value = route.fullPath
      console.log(route)
      loadInventoryDetails(currentRoute.value.p)
    }
  },
  { deep: true, immediate: true }
)
function loadInventoryDetails(id) {
  //load the inventory detail into the inventoryItem var
  svc.getFirstRecord('inventory', 'A', id).then((result) => {
    inventoryItem.value = result
    getSchedule(new Date().toDateString())
  })
}
function getSchedule(dateVal) {
  var date = new Date(dateVal),
    y = date.getFullYear(),
    m = date.getMonth()
  let firstDay = getFormattedDate(new Date(y, m, 1))
  let lastDay = getFormattedDate(new Date(y, m + 1, 0))
  console.log(firstDay)
  console.log(lastDay)

  svc
    .GetSheetData(
      'reservations',
      `WHERE D = ${inventoryItem.value.id} AND  B <= date '"&text("${firstDay}","yyyy-mm-dd")&"' AND C >= date '"&text("${lastDay}","yyyy-mm-dd")`
    )
    .then((result) => {
      console.log(result)
    })
}
function viewAdditionalInfo() {
  window.open(inventoryItem.value.infoURL)
}
function getFormattedDate(date) {
  var year = date.getFullYear()

  var month = (1 + date.getMonth()).toString()
  month = month.length > 1 ? month : '0' + month

  var day = date.getDate().toString()
  day = day.length > 1 ? day : '0' + day

  return year + '-' + month + '-' + day
}
</script>
<template>
  <div class="container-fluid" v-if="inventoryItem != null">
    <div class="row">
      <div class="col">
        <span class="fs-4">{{ inventoryItem.name }}</span>
        <span v-if="inventoryItem.available > 0" class="badge rounded-pill text-bg-primary ms-2"
          >In Stock now</span
        >
        <span v-if="inventoryItem.available == 0" class="badge rounded-pill text-bg-danger ms-2"
          >Unavailable</span
        >
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="row">
          <div class="col">navigation detail</div>
        </div>
        <div class="row">
          <div class="col-2">
            <img
              v-if="inventoryItem.image && inventoryItem.image.length > 0"
              :src="`/inventory/${inventoryItem.image}`"
              class="card-img-top result-image"
              :alt="inventoryItem.name"
            />
            <img
              v-if="!inventoryItem.image || inventoryItem.image.length == 0"
              src="/inventory/no-image.jpg"
              class="card-img-top result-image"
              :alt="inventoryItem.name"
            />
          </div>
          <div class="col text-start">
            <div class="row">
              <div class="col">
                <p>{{ inventoryItem.description }}</p>
                <button
                  v-if="inventoryItem.infoURL.length > 0"
                  v-on:click="viewAdditionalInfo"
                  type="button"
                  class="btn btn-info text-light"
                >
                  View Additional File
                </button>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <p class="pt-4">More</p>
                <span
                  :key="tag"
                  v-for="tag in inventoryItem.subtype.split(',')"
                  class="badge rounded-pill text-bg-info me-2 text-light tag"
                >
                  {{ tag }}
                </span>
                <p class="pt-4">Availability</p>
                <Calendar :attributes="scheduledDates" borderless expanded />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-3">
        <contactDetail></contactDetail>
      </div>
    </div>
  </div>
</template>
<style scoped>
.result-image {
  height: 8rem;
  max-width: 10rem;
  min-width: 10rem;
}
.tag:hover {
  cursor: pointer;
  background-color: #3cd6f4 !important;
}
</style>
