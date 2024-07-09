<script setup>
import { ref, onMounted } from 'vue'

const isExpanded = ref(false)
const inputControl = ref(null)
const props = defineProps(['option', 'checked'])
const emit = defineEmits(['filterUpdated', 'subFilterUpdated'])

const subFilters = ref([])
const mainFilter = ref({ option: {}, checked: false })

onMounted(() => {
  if (props.option) {
    setTimeout(() => {
      mainFilter.value = { option: props.option, checked: props.checked ? props.checked : false }

      if (mainFilter.value.option.subFilters.length > 0) {
        mainFilter.value.option.subFilters.forEach((item) => {
          subFilters.value.push({
            option: item,
            checked: props.checked ? props.checked : false
          })
        })
      }
      console.log('ran')
    }, 300)
  }
})

function parentChecked(option, isOptionChecked) {
  isExpanded.value = isOptionChecked
  mainFilter.value.checked = isOptionChecked
  emit('filterUpdated', mainFilter.value.option, isOptionChecked)

  if (subFilters.value.length > 0) {
    subFilters.value.forEach((item) => {
      item.checked = isOptionChecked
      // emit('filterUpdated', item.option, isOptionChecked, mainFilter.value.option)
    })
  }
}

function childChecked(option, isOptionChecked) {
  option.checked = isOptionChecked
  if (option.checked && !mainFilter.value.checked) {
    mainFilter.value.checked = true
    emit('filterUpdated', mainFilter.value.option, true)
    setTimeout(() => {
      emit('filterUpdated', option.option, isOptionChecked, mainFilter.value.option)
    }, 500)

    return
  }

  emit('filterUpdated', option.option, isOptionChecked, mainFilter.value.option)

  if (subFilters.value.filter((item) => item.checked).length == 0) {
    mainFilter.value.checked = false
    emit('filterUpdated', mainFilter.value.option, false)
  }
}
</script>

<template>
  <div class="row">
    <div class="col">
      <input
        class="form-check-input"
        :checked="mainFilter.checked"
        @input="(event) => parentChecked(mainFilter.option, event.target.checked)"
        type="checkbox"
        ref="inputControl"
        id="flexCheckDefault"
      />
      <label class="form-check-label" for="flexCheckDefault">
        {{ mainFilter.option.filterName }}
      </label>
      <div :class="{ collapse: !isExpanded, 'collapse.show': isExpanded }" id="collapse-panel">
        <div class="form-check" :key="subOption" v-for="subOption in subFilters">
          <input
            class="form-check-input sub-checkbox"
            :checked="subOption.checked"
            @input="(event) => childChecked(subOption, event.target.checked)"
            type="checkbox"
            ref="inputControl"
            id="flexCheckDefault"
          />
          <label class="form-check-label" for="flexCheckDefault">
            {{ subOption.option.filterName }}
          </label>
        </div>
      </div>
    </div>
    <div v-if="props.option.subFilters.length > 0" class="col-1">
      <i
        @click="() => (isExpanded = !isExpanded)"
        :class="{
          'bi bi-chevron-down expand-icon': !isExpanded,
          'bi bi-chevron-up expand-icon': isExpanded
        }"
      ></i>
    </div>
  </div>
</template>
<style scoped>
.expand-icon {
  cursor: pointer;
}
</style>
