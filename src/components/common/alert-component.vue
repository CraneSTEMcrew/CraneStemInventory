<script setup>
import { ref } from 'vue'
import { alertType } from '../../constants/alert-type.js'

const typeAlert = ref(alertType.SUCCESS)
const alertTitle = ref('')
const alertMessage = ref('')
const isVisible = ref(false)
const alertTime = ref(5)
defineExpose({
  showAlert
})

function showAlert(title, message, typeAlert, duration) {
  alertTitle.value = title
  alertMessage.value = message
  alertType.value = typeAlert
  isVisible.value = true
  alertTime.value = duration ? duration * 1000 : 5000
  setTimeout(() => {
    isVisible.value = false
  }, alertTime.value)
}
</script>
<template>
  <div v-if="isVisible" class="alert-container">
    <div class="toast show" :class="typeAlert">
      <div class="toast-header">
        <strong class="me-auto">{{ alertTitle }}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body alert-body">
        <p>{{ alertMessage }}</p>
      </div>
    </div>
    <!-- <div :class="typeAlert" class="alert" role="alert">{{ alertMessage }}</div> -->
  </div>
</template>
<style scoped>
.alert-container {
  position: fixed;
  right: 1rem;
  top: 1rem;
  z-index: 100;
}
.alert-body {
  color: white;
}
</style>
