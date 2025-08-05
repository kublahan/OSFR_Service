import '@/styles/fonts.css';
import '@/styles/reset.css';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery';
import 'popper.js';
import 'bootstrap';
import { setAuthToken } from '@/api/auth';

// Получаем токен из localStorage
const token = localStorage.getItem('adminToken');

// Если токен есть, устанавливаем его в axios перед монтированием приложения
if (token) {
  setAuthToken(token);
}

const app = createApp(App);

app.use(router);

router.beforeEach((to, from, next) => {
  const adminToken = localStorage.getItem('adminToken');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  // Если маршрут требует авторизации и токена нет, перенаправляем на страницу входа
  if (requiresAuth && !adminToken) {
    next({ name: 'auth' });
  } else {
    next();
  }
});

app.mount('#app');
