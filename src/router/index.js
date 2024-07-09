import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import InventoryView from '@/views/InventoryView.vue'
import InventoryDetailView from '@/views/inventory-detail-view.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/inventory/:filter?',
      name: 'inventory',
      component: InventoryView,
      props: true
    },
    {
      path: '/inventory/detail/:id/:filter',
      name: 'inventory-detail',
      component: InventoryDetailView,
      props: true
    }
  ]
})

export default router
