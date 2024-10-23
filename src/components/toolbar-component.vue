<script setup>
import { reactive, ref } from 'vue'
import router from '@/router'
import { filterParameters } from '@/classes/filter-parameter.js'

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
  let param = new filterParameters()
  param.filterText = filterText.value
  router.push({
    name: 'inventory',
    params: { filter: JSON.stringify(param) }
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
        class="col-xxl-1 col-2 col-xs-1 menu-item-col text-center"
        :class="{ active: router.currentRoute.value.name == 'home' }"
      >
        <div class="menu-item" @click="() => router.push('/')" title="Home">
          <i class="bi bi-house-door"></i>
          <span class="menu-item-name"> Home</span>
        </div>
      </div>
      <div
        class="col-xxl-1 col-2 col-xs-1 menu-item-col text-center"
        :class="{ active: router.currentRoute.value.name == 'inventory' }"
      >
        <div class="menu-item" @click="() => router.push('/inventory')" title="Inventory">
          <i class="bi bi-grid"></i>
          <span class="menu-item-name"> Inventory</span>
        </div>
      </div>
      <div ref="searchBoxCtrl" class="col text-end pe-5 pt-2 pb-2">
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
  @media (max-width: 600px) {
    margin-left: 0;
    margin-right: 0;
  }

  .menu-item-col:hover {
    cursor: pointer;
    background-color: #55616f;
  }
}

.menu-item {
  padding-top: 1rem;
  @media (max-width: 600px) {
    .menu-item-name {
      display: none;
    }
  }
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
  padding: 0.375rem;
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
  width: 20%;

  @media (max-width: 1024px) {
    width: 50%;
  }

  @media (max-width: 768px) {
    width: 90%;
  }
}

.search-box-input-large {
  width: 30%;
  @media (max-width: 1024px) {
    width: 70%;
  }

  @media (max-width: 768px) {
    width: 90%;
  }
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
