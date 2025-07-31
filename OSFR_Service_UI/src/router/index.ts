import { createRouter, createWebHistory } from 'vue-router';
import MainViewAdmin from '@/views/MainViewAdmin.vue';
import AuthorizationView from '@/views/AuthorizationView.vue';
import MainUserView from '@/views/MainUserView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainUserView,
      meta: {
        windowTitle: 'Главная страница',

      },
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthorizationView,
      meta: {
        windowTitle: 'Авторизация',
      },
    },

    {
      path: '/admin',
      name: 'admin',
      component: MainViewAdmin,
      meta: {
        windowTitle: 'Панель администратора',
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('adminToken');
  const isAuthenticated = !!token;

  if (to.meta.requiresAuth && !isAuthenticated) {

    next({ name: 'auth' });
  }  else {

    next();
  }
});

export default router;