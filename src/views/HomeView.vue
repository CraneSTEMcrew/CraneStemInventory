<script setup>
import { onMounted, ref } from 'vue'
import googleSheetsService from '@/services/google-sheets-service.js'
import { sortOption } from '@/constants/filterOptions'
const sheetID = import.meta.env.VITE_SHEETID
const svc = new googleSheetsService(sheetID)
const homepageContent = ref('')

onMounted(() => {
  loadHomePageContent()
})
function loadHomePageContent() {

  svc
    .GetSheetData(
      'homepage',
      '',
      1,
      1,
      new sortOption('Content', 'A asc')
    )
    .then((result) => {
      homepageContent.value=result[0][""]
    })
}
</script>

<template>
  <div class="container-fluid"  v-html="homepageContent">
  </div>
</template>

