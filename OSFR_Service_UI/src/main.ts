import '@/styles/fonts.css';
import '@/styles/reset.css';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery';
import 'popper.js';
import 'bootstrap';

const app = createApp(App);

app.use(router);

app.mount('#app');
