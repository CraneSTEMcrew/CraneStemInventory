<script setup>
import { reactive } from 'vue'

import router from '@/router'

const isSearchFocused = reactive({
  value: false
})

function setFocusState(isFocus) {
  isSearchFocused.value = isFocus
}

//computed
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
      <div class="col"></div>
      <div ref="searchBoxCtrl" class="col-2 d-flex align-items-center">
        <div id="search-box" class="input-group">
          <input
            type="text"
            @focus="setFocusState(true)"
            @blur="setFocusState(false)"
            ref="searchBox"
            class="form-control"
            :class="{
              'search-box-input-large': isSearchFocused.value,
              'search-box-input': !isSearchFocused.value
            }"
            placeholder="Search"
            aria-label="Search"
          />
          <i
            id="search-box-icon"
            :class="{ 'search-box-large-icon': isSearchFocused.value }"
            class="bi bi-search"
          ></i>
        </div>
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
  width: 50%;
  text-indent: 10px;
}
.search-box-input-large {
  width: 90%;
  text-indent: 10px;
}

#search-box-icon {
  color: white;
  top: 0.75rem;
  z-index: 100;
  left: 40%;
  position: absolute;
}
.search-box-large-icon {
  left: 80% !important;
}

::placeholder {
  color: white;
  opacity: 1; /* Firefox */
}
</style>
