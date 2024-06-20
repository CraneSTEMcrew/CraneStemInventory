import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

//local vs remote
const isDev = true

//global vars

app.config.globalProperties.imageURL = isDev
  ? '/inventory/'
  : 'https://drive.google.com/drive/folders/12vAGT1i7oQ9qIQYwDw3TUbTwryEcutMa/'

app.config.globalProperties.test = true
//end global vars

app.use(createPinia())
app.use(router)

app.mount('#app')
