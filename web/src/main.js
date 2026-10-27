import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import LineupView from './LineupView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home' },
    { path: '/genre/:genre', name: 'genre', component: LineupView },
  ],
})

createApp(App).use(router).mount('#app')
