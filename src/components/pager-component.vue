<script setup>
const emit = defineEmits(['pageUpdated'])
const props = defineProps(['currentPage', 'pageTotal'])

function pageChanged(newPage) {
  if (newPage <= 0 || newPage == props.currentPage || newPage > props.pageTotal) return
  emit('pageUpdated', newPage)
}
</script>
<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      <li
        class="page-item"
        @click="pageChanged(props.currentPage - 1)"
        :class="{ disabled: props.currentPage == 1 }"
      >
        <a class="page-link" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li
        :key="n"
        :class="{ active: props.currentPage == n }"
        v-for="n in props.pageTotal"
        class="page-item"
        @click="pageChanged(n)"
      >
        <a class="page-link" href="#">{{ n }}</a>
      </li>

      <li
        class="page-item"
        @click="pageChanged(props.currentPage + 1)"
        :class="{ disabled: props.currentPage == props.pageTotal }"
      >
        <a class="page-link" href="#" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>
