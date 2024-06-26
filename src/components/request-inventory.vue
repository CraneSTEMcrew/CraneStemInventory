<script setup>
import { ref } from 'vue'
import { inventoryRequest } from '../classes/inventory-request'
import requestService from '@/services/request-service.js'

const emit = defineEmits(['dismiss', 'requestCreated'])
const props = defineProps(['isVisible', 'inventoryItem'])

const requestForm = {
  firstName: ref(''),
  lastName: ref(''),
  email: ref(''),
  quantity: ref(0),
  startDate: ref(''),
  endDate: ref('')
}

const errors = ref({})

const validateField = (field) => {
  errors.value[field] = '' // Clear previous error for the field

  if (field === 'email' && !requestForm.email.value.includes('@')) {
    errors.value.email = 'Invalid email address.'
  }
  if (field === 'firstName' && !requestForm.firstName.value.replace(' ', '').length > 0) {
    errors.value.firstName = 'First Name is required.'
  }
  if (field === 'lastName' && !requestForm.lastName.value.replace(' ', '').length > 0) {
    errors.value.lastName = 'Last Name is required.'
  }

  if (field === 'quantity' && requestForm.quantity.value == 0) {
    errors.value.quantity = 'Quantity is required.'
  }

  if (field === 'quantity' && requestForm.quantity.value > props.inventoryItem.quantity) {
    errors.value.quantity = 'Quantity cannot exceed total number available'
  }

  if (field === 'startDate' && !requestForm.startDate.value.replace(' ', '').length > 0) {
    errors.value.startDate = 'Start Date is required.'
  }

  // if (
  //   field === 'startDate' &&
  //   requestForm.startDate.value.length > 0 &&
  //   new Date(requestForm.startDate.value) < new Date()
  // ) {
  //   errors.value.startDate = 'Start Date cannot be before current date'
  // }
  if (field === 'endDate' && !requestForm.endDate.value.replace(' ', '').length > 0) {
    errors.value.endDate = 'End Date is required.'
  }
  if (
    field === 'endDate' &&
    requestForm.endDate.value.length > 0 &&
    new Date(requestForm.endDate) < new Date()
  ) {
    errors.value.endDate = 'End Date cannot be before current date'
  }
  if (
    field === 'endDate' &&
    requestForm.startDate.value.length > 0 &&
    requestForm.startDate.value.length > 0 &&
    new Date(requestForm.endDate.value) < new Date(requestForm.startDate.value)
  ) {
    errors.value.endDate = 'End Date cannot be before start date'
  }
}

function dismiss() {
  emit('dismiss')
}
function submitForm() {
  let errorCount = 0
  errors.value = {} // Clear previous errors

  validateField('firstName')
  validateField('lastName')
  validateField('email')
  validateField('quantity')
  validateField('startDate')
  validateField('endDate')

  for (const [key, value] of Object.entries(errors.value)) {
    errorCount += value.length > 0 ? 1 : 0
  }

  if (errorCount == 0) {
    //if no errors are found
    let request = new inventoryRequest(props.inventoryItem.id, props.inventoryItem.name)
    request.startDate = requestForm.startDate.value
    request.endDate = requestForm.endDate.value
    request.contactEmail = requestForm.email.value
    request.contactName = `${requestForm.firstName.value} ${requestForm.lastName.value}`
    request.requestedQuantity = requestForm.quantity.value

    //we need to validate that there is enough during that time to request
    let svc = new requestService(props.inventoryItem.id)
    svc.isRequestFeasible(request, props.inventoryItem.quantity).then((result) => {
      console.log(result)
      if (result) {
        emit('requestCreated', request)
      } else {
        errors.value.quantity =
          'The total quantity selected is not available during the times you have selected.'
      }
    })
  } else {
    console.log('Form has validation errors. Please correct them.')
  }
}
</script>
<template>
  <div v-show="props.isVisible" id="background">
    <div
      class="offcanvas offcanvas-end show"
      tabindex="-1"
      id="offcanvas"
      aria-labelledby="offcanvasLabel"
    >
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasLabel">Request Inventory Item</h5>
        <button
          type="button"
          @click="dismiss"
          class="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div class="offcanvas-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <p>
                Item : <i>{{ props.inventoryItem ? props.inventoryItem.name : '' }}</i
                ><br />
                Total Quantity Available:
                <i>{{ props.inventoryItem ? props.inventoryItem.quantity : 0 }}</i>
              </p>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <form @submit.prevent="submitForm">
                <div class="mb-3">
                  <label class="form-label">First Name</label>
                  <input
                    type="text"
                    v-model="requestForm.firstName.value"
                    class="form-control"
                    id="requestedFirstName"
                  />
                  <div class="invalid" v-if="errors.firstName">
                    {{ errors.firstName }}
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Last Name</label>
                  <input
                    v-model="requestForm.lastName.value"
                    type="text"
                    class="form-control"
                    id="requestedLastName"
                  />
                  <div class="invalid" v-if="errors.lastName">
                    {{ errors.lastName }}
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input
                    v-model="requestForm.email.value"
                    type="email"
                    class="form-control"
                    id="requestedEmail"
                  />
                  <div class="invalid" v-if="errors.email">
                    {{ errors.email }}
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Quantity Requested</label>
                  <input
                    v-model="requestForm.quantity.value"
                    type="number"
                    class="form-control"
                    id="requestedNumber"
                  />
                  <div class="invalid" v-if="errors.quantity">
                    {{ errors.quantity }}
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Start Date</label>
                  <input
                    v-model="requestForm.startDate.value"
                    type="date"
                    class="form-control"
                    id="requestedStart"
                  />
                  <div class="invalid" v-if="errors.startDate">
                    {{ errors.startDate }}
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">End Date</label>
                  <input
                    v-model="requestForm.endDate.value"
                    type="date"
                    class="form-control"
                    id="requestedEnd"
                  />
                  <div class="invalid" v-if="errors.endDate">
                    {{ errors.endDate }}
                  </div>
                </div>
                <div class="col text-end">
                  <button type="submit" class="btn btn-primary">Request</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.invalid {
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: var(--bs-form-invalid-color);
}
#background {
  z-index: 40;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(127, 127, 127, 0.5);
  animation: fadein 0.1s;
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.5;
  }
}
</style>
