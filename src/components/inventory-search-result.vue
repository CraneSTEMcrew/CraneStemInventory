<script setup>
const props = defineProps(['data', 'isGrid'])
const emit = defineEmits(['itemSelected'])

function inventoryItemClicked() {
  emit('itemSelected', props.data)
}
</script>
<template>
  <div class="col-4 inventory-result" v-if="props.isGrid">
    <div class="card" title="View Details" @click="inventoryItemClicked">
      <div class="text-center pt-2">
        <img
          v-if="props.data.image"
          :src="`${imageURL + props.data.image}`"
          class="card-img-top result-image"
          :alt="props.data.name"
        />
        <img
          v-if="!props.data.image"
          :src="`${imageURL}no-image.jpg}`"
          class="card-img-top result-image"
          :alt="props.data.name"
        />
      </div>
      <div class="card-body">
        <div class="container-fluid card-text ps-2 pt-2">
          <div class="row">
            <div class="col ps-0 inventory-title">
              {{ props.data.name }}
            </div>
          </div>
          <div class="row">
            <div class="col ps-0 pt-2">
              <span v-if="props.data.available > 0" class="badge rounded-pill text-bg-primary"
                >In Stock now</span
              >
              <span v-if="props.data.available == 0" class="badge rounded-pill text-bg-danger"
                >Unavailable</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="col-12 inventory-result" v-if="!props.isGrid">
    <div class="card" title="View Details">
      <div class="container-fluid">
        <div class="row">
          <div class="col-2">
            <img
              v-if="props.data.image"
              :src="`/inventory/${props.data.image}`"
              class="card-img-top result-image"
              :alt="props.data.name"
            />
            <img
              v-if="!props.data.image"
              src="/inventory/no-image.jpg"
              class="card-img-top result-image"
              :alt="props.data.name"
            />
          </div>
          <div class="col text-start pt-2 inventory-title">
            {{ props.data.name }}
          </div>
          <div class="col text-end pt-2">
            <span v-if="props.data.available > 0" class="badge rounded-pill text-bg-primary"
              >In Stock now</span
            >
            <span v-if="props.data.available == 0" class="badge rounded-pill text-bg-danger"
              >Unavailable</span
            >
          </div>
        </div>
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
.inventory-result {
  cursor: pointer;
}

.card:hover {
  .inventory-title {
    font-weight: 500;
  }
}
</style>
