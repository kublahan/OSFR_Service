import { createRouter, createWebHistory } from 'vue-router';
import MainViewAdmin from '@/views/MainViewAdmin.vue';
import AuthorizationView from '@/views/AuthorizationView.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component:MainViewAdmin,
            meta: {
                windowTitle: 'Главная страница админа',
            },
        },

        {
            path: '/auth',
            name: 'auth',
            component:AuthorizationView,
            meta: {
                windowTitle: 'Авториация',
            },
        },
    ],
});

export default router;