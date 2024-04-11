<script setup>
import { ref, onMounted, watch } from 'vue'
import googleSheetsService from '@/services/google-sheets-service.js'

const sheetID = '1V3SJog_ZNjtaEg2k2BJ_6if7cDcCuneS1tWH7cf1e-0'  //move to constants
const props = defineProps(['id'])
const inventoryItem = ref(null)
const svc = new googleSheetsService(sheetID)

onMounted( () => {
  if (props.id){
    loadInventoryDetails(props.id)
  }

})
function loadInventoryDetails(id){
//load the inventory detail into the inventoryItem var
  svc
    .getFirstRecord(
      'inventory',
      'A',
      id
    )
    .then((result) => {

      inventoryItem.value = result;

    })
}
</script>
<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <span class="fs-4">{{inventoryItem.name}}</span>
        <span v-if="inventoryItem.available > 0" class="badge rounded-pill text-bg-primary ms-2"
        >In Stock now</span
        >
        <span v-if="inventoryItem.available == 0" class="badge rounded-pill text-bg-danger ms-2"
        >Unavailable</span
        >
      </div>
    </div>
    {{inventoryItem}}
  </div>

</template>