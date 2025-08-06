import { createRouter, createWebHistory } from 'vue-router';
import MainViewAdmin from '@/views/MainViewAdmin.vue';
import AuthorizationView from '@/views/AuthorizationView.vue';
import MainUserView from '@/views/MainUserView.vue';
import ResourcesEditView from '@/views/ResourcesEditView.vue';
import InstructionForm from '@/views/InstructionFormView.vue';
import InstructionView from '@/views/InstructionView.vue';

const routes = [
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
  {
    path: '/admin/resources/add',
    name: 'resource-add',
    component: ResourcesEditView,
    meta: {
      requiresAuth: true,
      windowTitle: 'Добавить ресурс'
    }
  },
  {
    path: '/admin/resources/edit/:id',
    name: 'resource-edit',
    component: ResourcesEditView,
    meta: {
      requiresAuth: true,
      windowTitle: 'Редактировать ресурс'
    },
    props: true,
  },

  {
    path: '/admin/instructions/add',
    name: 'instruction-add',
    component: InstructionForm,
    meta: {
      requiresAuth: true,
      windowTitle: 'Добавить инструкцию'
    }
  },
  {
    path: '/admin/instructions/edit/:id',
    name: 'instruction-edit',
    component: InstructionForm,
    meta: {
      requiresAuth: true,
      windowTitle: 'Редактировать инструкцию'
    },
    props: true,
  },
  {
    path: '/admin/instructions/view/:id',
    name: 'instruction-view',
    component: InstructionView,
    meta: {
      requiresAuth: true,
      windowTitle: 'Просмотр инструкции'
    },
    props: true,
  },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
