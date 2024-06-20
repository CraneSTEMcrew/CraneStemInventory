<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import requestInventory from '../components/request-inventory.vue'
import contactDetail from '../components/contact-detail.vue'
import alert from '../components/common/alert-component.vue'
import googleSheetsService from '@/services/google-sheets-service.js'
import emailService from '@/services/email-service.js'
import 'v-calendar/style.css'
import { Calendar } from 'v-calendar'
import { alertType } from '@/constants/alert-type'

const sheetID = '1V3SJog_ZNjtaEg2k2BJ_6if7cDcCuneS1tWH7cf1e-0' //move to constants
const props = defineProps(['id'])
const inventoryItem = ref(null)
const svc = new googleSheetsService(sheetID)
const emailSvc = new emailService()
const route = useRoute()
const currentRoute = ref(null)
const scheduledDates = ref([])
const showModal = ref(false)
const alertComponent = ref(null)
let currentMonth = undefined

onMounted(() => {
  currentMonth = new Date().getMonth() + 1
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
function requestCreated(request) {
  // let publicKey = import.meta.env.VITE_EMAILPUBLICKEY
  // let template = import.meta.env.VITE_EMAILTEMPLATEID
  // let serviceKey = import.meta.env.VITE_EMAILSERVICEKEY
  // let emailMessage = `The following request has been created:<br>Requested by: <b>${request.contactName}</b>br>Email: <b>${request.contactEmail}</b>`
  // emailMessage +=`<p><table>`
  // let templateParams = {
  //   message: emailMessage
  // }
  // requestDate: request.requestDate,
  //   id: request.id,
  //   itemDescription: request.itemDescription,
  //   requestedQuantity: request.requestedQuantity,
  //   startDate: request.startDate,
  //   endDate: request.endDate,
  //   contactName: request.contactName,
  //   contactEmail: request.contactEmail,
  //   from_email: 'somniloquent@gmail.com'

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
                    v-if="inventoryItem.infoURL && inventoryItem.infoURL.length > 0"
                    v-on:click="viewAdditionalInfo"
                    type="button"
                    class="btn btn-info text-light"
                  >
                    View Additional File
                  </button>
                  <p class="pt-4">
                    Current Number Available: <b>{{ inventoryItem.available }}</b>
                  </p>
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
                  <Calendar
                    :attributes="scheduledDates"
                    @update:pages="updateSchedule"
                    borderless
                    expanded
                  >
                    <template #footer>
                      <div class="container-fluid text-center">
                        <button @click="showRequestForm" class="btn btn-warning">
                          Request {{ inventoryItem.name }}
                        </button>
                      </div>
                    </template>
                  </Calendar>
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
</style>
