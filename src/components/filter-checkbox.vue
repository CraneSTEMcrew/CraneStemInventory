<script setup>
const props = defineProps(['option'])
const emit = defineEmits(['filterUpdated'])
let checked = false
</script>

<template>
  <input
    class="form-check-input"
    :checked="checked"
    @input="(event) => emit('filterUpdated', props.option.filterName, event.target.checked)"
    type="checkbox"
    id="flexCheckDefault"
  />
  <label class="form-check-label" for="flexCheckDefault"> {{ props.option.filterName }} </label>
</template>
