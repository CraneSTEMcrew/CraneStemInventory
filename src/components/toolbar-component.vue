<script setup>
import { reactive, ref } from 'vue'
import router from '@/router'
const filterText = ref('')
const isSearchFocused = reactive({
  value: false
})
const isFilterLocked = ref(false)
const filterInput = ref(null)

function setFocusState(isFocus) {
  isSearchFocused.value = isFocus
}

function clearFilter() {
  filterInput.value.focus()
  filterText.value = ''
  isFilterLocked.value = false

  router.push({
    name: 'inventory'
  })
}
function filterTextUpdated() {
  if (!filterText.value || filterText.value.length == 0) return
  router.push({
    name: 'inventory',
    params: { filter: filterText.value }
  })
  filterText.value = ''
  isSearchFocused.value = false
  isFilterLocked.value = false
  filterInput.value.blur()
}
</script>
<template>
  <div id="tool-bar" class="p-0">
    <div class="row tools-row">
      <div
        :class="{ active: router.currentRoute.value.name == 'home' }"
        class="col-1 menu-item text-center menu-item"
        @click="() => router.push('/')"
      >
        <i class="bi bi-house-door"></i> Home
      </div>
      <div
        :class="{ active: router.currentRoute.value.name == 'inventory' }"
        class="col-1 menu-item text-center menu-item"
        @click="() => router.push('/inventory')"
      >
        <i class="bi bi-grid"></i> Inventory
      </div>

      <div ref="searchBoxCtrl" class="col text-end pt-2">
        <input
          type="text"
          @focus="setFocusState(true)"
          @blur="setFocusState(false)"
          ref="filterInput"
          class="search-box-input"
          @keydown="isFilterLocked = true"
          @keyup.enter="filterTextUpdated"
          v-model="filterText"
          :class="{
            'search-box-input-large': isFilterLocked || isSearchFocused.value
          }"
          placeholder="Search"
          aria-label="Search"
        />
        <i
          id="search-box-icon"
          v-if="filterText.length == 0 && !isFilterLocked"
          class="bi bi-search"
        ></i>
        <i
          id="search-box-icon"
          @click="clearFilter"
          v-if="filterText.length != 0"
          class="bi bi-x"
        ></i>
      </div>
      <div class="col-1"></div>
    </div>
  </div>
</template>
<style scoped>
@keyframes grow-animation {
  from {
    width: 50%;
  }
  to {
    width: 90%;
  }
}

.grow {
  animation: grow-animation;
}

#tool-bar {
  background-color: #12171d;

  color: white;
}
.tools-row {
  margin-left: 6%;
  margin-right: 5%;

  .menu-item:hover {
    cursor: pointer;
    background-color: #55616f;
  }
}

.menu-item {
  padding: 1rem;
}
.active {
  background-color: #55616f;
}
.menu-item:hover {
  text-decoration: underline;
}
#search-box {
  padding-top: 0.5rem;

  input {
    color: white;
    background-color: #434e5b;
    border-color: #434e5b;
  }
}

.search-box-input {
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: white;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: var(--bs-body-bg);
  background-clip: padding-box;
  background-color: #434e5b;

  border: var(--bs-border-width) solid #434e5b;
  border-radius: var(--bs-border-radius);
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  text-indent: 10px;
  width: 10em;
}
.search-box-input-large {
  width: 30em;
  text-indent: 10px;
}

#search-box-icon {
  color: white;
  margin-left: -2rem;
  top: 0.75rem;
  z-index: 100;
}

::placeholder {
  color: white;
  opacity: 1; /* Firefox */
}
</style>
