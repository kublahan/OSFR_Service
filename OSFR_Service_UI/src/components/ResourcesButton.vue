<script lang="ts">
import { defineComponent, type PropType } from 'vue';


interface ButtonItem {
    id: number;
    category_id: number;
    name: string;
    service: string;
    url: string;
}


export default defineComponent({
    name: 'ResourcesButton',

    props: {
        item: {
            type: Array as PropType<ButtonItem[]>,
            required: true,
        },
    },
});
</script>

<template>
<a 
    :href="item.url" 
    target="_blank" 
    class="main-container"
    rel="noopener noreferrer"
  >
    <div class="content-wrapper">
      <div class="name-item">{{ item.name }}</div>
      <div class="name-serv">{{ item.service }}</div>
      <div class="action-btn">Перейти</div>
    </div>
  </a>

<!-- Если ссылки ведут на внутренние ресурсы
<router-link :to="item.url" class="action-btn">
  Открыть
</router-link> -->

</template>

<style scoped>
.main-container {
  display: block;
  width: 21rem;
  height: 11.25rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: 1.5625rem;
  background: white;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  cursor: pointer;
}

.main-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.content-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.name-item {
  font-size: 1.375rem;
  margin-bottom: 0.5rem;
  font-family: 'Inter-Regular';
  color: #000000;
}

.name-serv {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
}

.action-btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #D6E9FD;
  color: #191F66;
  border-radius: 0.5rem;
  text-align: center;
  width: fit-content;
  align-self: flex-end;
}

.main-container:hover .action-btn {
  background-color: #c0d9fa;
}
</style>