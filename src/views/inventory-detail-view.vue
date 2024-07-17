<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import requestInventory from '../components/request-inventory.vue'
import contactDetail from '../components/contact-detail.vue'
import alert from '../components/common/alert-component.vue'
import googleSheetsService from '@/services/google-sheets-service.js'
import { filterParameters } from '../classes/filter-parameter'
import emailService from '@/services/email-service.js'
import 'v-calendar/style.css'
import { Calendar } from 'v-calendar'
import router from '@/router/index.js'
import imageService from '../services/image-service'

const sheetID = import.meta.env.VITE_SHEETID
const props = defineProps(['id', 'filter'])
const inventoryItem = ref(null)
const svc = new googleSheetsService(sheetID)

const emailSvc = new emailService()
const route = useRoute()
const currentRoute = ref(null)
const scheduledDates = ref([])
const showModal = ref(false)
const alertComponent = ref(null)
const appliedFilters = ref({})
let currentMonth = undefined

onMounted(() => {
  currentMonth = new Date().getMonth() + 1
  currentRoute.value = route.fullPath
  console.log(props)
  appliedFilters.value = JSON.parse(props.filter)
  console.log(appliedFilters)
  if (props.id) {
    loadInventoryDetails(props.id)
  }
})
watch(
  route,
  () => {
    if (currentRoute.value && route.fullPath !== currentRoute.value) {
      currentRoute.value = route.fullPath
      loadInventoryDetails(currentRoute.value.p)
    }
  },
  { deep: true, immediate: true }
)
function loadInventoryDetails(id) {
  //load the inventory detail into the inventoryItem var
  svc.getFirstRecord('inventory', 'A', id).then((result) => {
    inventoryItem.value = result
    console.log(result)
    getSchedule(new Date().toDateString())
  })
}
function getSchedule(dateVal) {
  var date = new Date(dateVal),
    y = date.getFullYear(),
    m = date.getMonth()
  let firstDay = getFormattedDate(new Date(y, m, 1))
  let lastDay = getFormattedDate(new Date(y, m + 1, 0))

  //clear the calendar
  scheduledDates.value = []

  svc
    .GetSheetData(
      'reservations',
      `SELECT * WHERE D = ${inventoryItem.value.id} AND  (B >=  date '${firstDay}' OR C <= date '${lastDay}')`
    )
    .then((result) => {
      result.forEach((val) => {
        scheduledDates.value.push({
          highlight: {
            color: 'red',
            fillMode: 'light'
          },
          dates: { start: new Date(val.start), end: new Date(val.end) },
          popover: {
            label: `Reserved: ${val.requested_qty} : ${new Date(val.start).toDateString()} - ${new Date(val.end).toDateString('mm-dd-yyyy')}`
          }
        })
      })
    })
}
function updateSchedule(val) {
  if (currentMonth != val[0].month) {
    currentMonth = val[0].month

    getSchedule(`${val[0].month}-01-${val[0].year}`)
  }
}
function showRequestForm() {
  showModal.value = true
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
function dayClicked(day, e) {
  console.log(day)
}
function requestCreated(request) {
  emailSvc.createInternalNotificationEmail(request)
  emailSvc
    .createConfirmationEmail(request)
    .then(() => {
      showModal.value = false
      alertComponent.value.showAlert(
        'Request Created',
        `Your request for ${request.requestedQuantity} ${request.itemDescription} has been submitted.  A confirmation email has been sent to ${request.contactEmail}`,
        alertType.SUCCESS
      )
    })
    .catch(() => {
      showModal.value = false
      alertComponent.value.showAlert(
        'Error',
        'An Error Occurred.  Please contact stem@stem.com for further assistance',
        alertType.ERROR
      )
    })
}
function navigateBack(filterType, tagVal) {
  let param = new filterParameters()

  switch (filterType.toString().toLowerCase()) {
    case 'filter':
      param.typeFilter.push(inventoryItem.value.type)
      break
    case 'subfilter':
      param.typeFilter.push(inventoryItem.value.type)
      param.subTypeFilter.push(
        appliedFilters.value.subTypeFilter.length > 0
          ? appliedFilters.value.subTypeFilter[0]
          : inventoryItem.value.subtype.split(',')[0]
      )
      break
    case 'category':
      if (tagVal != undefined) {
        param.categoryFilter.push(tagVal)
        break
      }
      param.categoryFilter.push(
        appliedFilters.value.categoryFilter.length > 0
          ? appliedFilters.value.categoryFilter[0]
          : inventoryItem.value.category.split(',')[0]
      )
      break
  }
  router.push({
    name: 'inventory',
    params: { filter: JSON.stringify(param) }
  })
}
</script>
<template>
  <div class="container-fluid">
    <alert ref="alertComponent"></alert>
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
            <div class="col text-start navigation">
              <button @click="navigateBack('filter')" type="button" class="btn btn-link text-info">
                {{ inventoryItem.type }}
              </button>
              <i
                v-if="appliedFilters.subTypeFilter.length > 0 || inventoryItem.subtype.length > 0"
                class="bi bi-chevron-double-right"
              ></i>
              <button
                v-if="appliedFilters.subTypeFilter.length > 0 || inventoryItem.subtype.length > 0"
                @click="navigateBack('subfilter')"
                type="button"
                class="btn btn-link text-info"
              >
                {{
                  appliedFilters.subTypeFilter.length > 0
                    ? appliedFilters.subTypeFilter[0]
                    : inventoryItem.subtype.split(',')[0]
                }}</button
              ><i class="bi bi-chevron-double-right"></i
              ><button
                @click="navigateBack('category')"
                type="button"
                class="btn btn-link text-info"
              >
                {{
                  appliedFilters.categoryFilter.length > 0
                    ? appliedFilters.categoryFilter[0]
                    : inventoryItem.category.split(',')[0]
                }}
              </button>
            </div>
          </div>
          <div class="row">
            <div class="col-1 col-md-3">
              <div class="row">
                <div class="col-12 text-center">
                  <img
                    :src="imageService.formatImageUrl(inventoryItem.image)"
                    class="card-img-top result-image"
                    :alt="inventoryItem.name"
                  />
                </div>
                <div class="col-12 text-center pt-4">
                  <button @click="showRequestForm" class="btn btn-warning">Request</button>
                </div>
              </div>

              <div class="container-fluid text-center"></div>
            </div>
            <div class="col col-md-9 text-start">
              <div class="row">
                <div class="col">
                  <p v-html="inventoryItem.description"></p>
                  <button
                    v-if="inventoryItem.infoURL && inventoryItem.infoURL.length > 0"
                    v-on:click="viewAdditionalInfo"
                    type="button"
                    class="btn btn-link text-info ps-0"
                  >
                    View Additional File
                  </button>
                  <p class="pt-4 h6">
                    Current Number Available: <i>{{ inventoryItem.available }}</i>
                  </p>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <span
                    :key="tag"
                    @click="navigateBack('category', tag)"
                    v-for="tag in inventoryItem.category.split(',')"
                    class="badge rounded-pill text-bg-info me-2 text-light tag"
                  >
                    {{ tag }}
                  </span>

                  <p class="pt-4 h6">Availability</p>
                  <Calendar
                    :attributes="scheduledDates"
                    @update:pages="updateSchedule"
                    @dayclick="dayClicked"
                    borderless
                    expanded
                  >
                  </Calendar>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-12 col-lg-3">
          <contactDetail></contactDetail>
        </div>
      </div>
    </div>
    <requestInventory
      @dismiss="() => (showModal = false)"
      :is-visible="showModal"
      :inventory-item="inventoryItem"
      @requestCreated="requestCreated"
    ></requestInventory>
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
.navigation {
  button {
    padding-left: 0;
  }
  i {
    font-size: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>
