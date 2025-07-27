import { createRouter, createWebHistory } from 'vue-router';
import MainView from '@/views/MainView.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component:MainView,
            meta: {
                windowTitle: 'Главная страница',
            },
        },
    ],
});

export default router;