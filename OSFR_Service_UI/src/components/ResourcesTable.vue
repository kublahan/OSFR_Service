// ResourcesTable.vue
<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

interface TableItem {
  id: number | string;
  category_id: number | string;
  category_name?: string;
  name: string;
  service: string;
  url: string;
}

export default defineComponent({
  name: 'ResourcesTable',
  props: {
    items: {
      type: Array as PropType<TableItem[]>,
      required: true,
      default: () => [],
    },
  },
  watch: {

    items: {
      handler(newItems) {
        console.log('ResourcesTable: received items prop update. First item category_name:', newItems[0]?.category_name);

      },
      deep: true,
      immediate: true
    }
  }
});
</script>

<template>
  <div class="table-responsive table-container">
    <table class="table">
      <thead>
        <tr>
          <th class="col-category">Категория</th>
          <th class="col-name">Наименование</th>
          <th class="col-service">Сервис</th>
          <th class="col-action">Действие</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td class="category">{{ item.category_name }}</td> 
          <td class="name">{{ item.name }}</td>
          <td>{{ item.service }}</td>
          <td>
            <a :href="item.url" target="_blank" class="action-btn">
              Открыть
            </a>
          </td>
        </tr>
        <tr v-if="items.length === 0">
          <td colspan="4" style="text-align: center; padding: 20px;">
            Нет данных для отображения.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>


.table-container {
  margin: 20px auto;
  border-radius: 8px;
  overflow: hidden;
  width: 118.75rem;
  max-width: 100%;
  overflow-x: auto;
}


.table {
  width: 100%;
  border-collapse: collapse;
}


.table th {
  background-color: #D6E9FD;
  color: #1A185C;
  font-weight: 600;
  font-size: 25px;
  text-align: center;
  padding: 12px 16px;
}


.table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  color: #000000;
  font-size: 25px;
  font-family: 'Inter-Regular';
  text-align: center;
}


.table td.name {
  text-align: left;
}


.action-btn {
  padding: 6px 12px;
  background-color: transparent;
  border: none;
  box-shadow: none;
  color: #1150B0;
  cursor: pointer;
  font-size: 25px;
  font-family: 'Inter-Regular';
  text-decoration: none;
}


td.category {
  color: #1A185C;
}


.table tbody tr:nth-child(even) {
  background-color: #EDF6FF;
}

.table tbody tr:nth-child(odd) {
  background-color: #FFFFFF;
}


.table th.col-category,
.table td.category {
  width: 15.4375rem;
  padding-right: 4.75rem;
}

.table th.col-name,
.table td.name {
  width: 45.5625rem;

}

.table th.col-service {
  width: 150px;
}

.table th.col-action {
  width: 120px;
}

.table th.col-name {
  text-align: center;
}
</style>