<script lang="ts">
import api from '@/api/auth';
import { defineComponent, ref, PropType } from 'vue';


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
    },
  },
  emits: ['resource-deleted'],
  
  setup(props, { emit }) {
    const showConfirmModal = ref(false);
    const showErrorModal = ref(false);
    const itemToDelete = ref<number | string | null>(null);
    const errorMessage = ref('');

    const showConfirmation = (id: number | string) => {
      itemToDelete.value = id;
      showConfirmModal.value = true;
    };

    const confirmDelete = async () => {
      if (itemToDelete.value) {
        try {
          await api.delete(`/admin/resources/${itemToDelete.value}`);
          console.log(`Ресурс с ID ${itemToDelete.value} успешно удален.`);
          emit('resource-deleted');
        } catch (error) {
          console.error(`Ошибка при удалении ресурса с ID ${itemToDelete.value}:`, error);
          errorMessage.value = `Ошибка при удалении ресурса. Возможно, у вас нет прав на это действие или токен устарел.`;
          showErrorModal.value = true;
        } finally {
          showConfirmModal.value = false;
          itemToDelete.value = null;
        }
      }
    };

    const cancelDelete = () => {
      showConfirmModal.value = false;
      itemToDelete.value = null;
    };

    const closeErrorModal = () => {
      showErrorModal.value = false;
      errorMessage.value = '';
    };
    
    return {
      showConfirmModal,
      showErrorModal,
      errorMessage,
      showConfirmation,
      confirmDelete,
      cancelDelete,
      closeErrorModal
    };
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
            <div class="actions-container">
              <a :href="item.url" target="_blank" class="action-btn">
              Открыть
            </a>
            <router-link :to="{ name: 'resource-edit', params: { id: item.id } }" class="edit-link">
                <button class="edit-btn">
                  <img src="@/assets/icons/Edit_Pencil.svg" alt="Pencil edit img">
                </button>
              </router-link>

              <button @click="showConfirmation(item.id)" class="delete-btn">
                <img src="@/assets/icons/Trash_Full.svg" alt="Delete img">
              </button>
            </div>
            
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


  <div v-if="showConfirmModal" class="modal-overlay">
    <div class="modal-content">
      <p>Вы уверены, что хотите удалить этот ресурс?</p>
      <div class="modal-actions">
        <button @click="confirmDelete" class="save-btn">Да</button>
        <button @click="cancelDelete" class="back-btn">Нет</button>
      </div>
    </div>
  </div>


  <div v-if="showErrorModal" class="modal-overlay">
    <div class="modal-content">
      <p>{{ errorMessage }}</p>
      <div class="modal-actions">
        <button @click="closeErrorModal" class="save-btn">ОК</button>
      </div>
    </div>
  </div>
</template>

<style scoped>


.table-container {
  margin: 20px auto;
  border-radius: 8px;
  overflow: hidden;
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

td.category {
  color: #1A185C;
}


.table tbody tr:nth-child(even) {
  background-color: #EDF6FF;
}

.table tbody tr:nth-child(odd) {
  background-color: #FFFFFF;
}

.actions-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
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

.edit-btn,
.delete-btn {
    width: 2.875rem;
    height: 2.875rem;
    border-radius: 0.625rem;
    background: #D6E9FD;
    border: none;
    cursor: pointer;
    display: flex; 
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s;
}

.delete-btn {
    background: red; 
}

.edit-btn:hover {
    background-color: #c4e1ff;
}

.delete-btn:hover {
    background-color: #ffc4c4;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 30px 40px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 400px;
}

.modal-content p {
  font-size: 1.5rem;
  color: #1A185C;
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.save-btn, .back-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s;
}

.save-btn {
  background-color: #1150B0;
  color: #fff;
}

.save-btn:hover {
  background-color: #0d3a82;
}

.back-btn {
  background-color: #f0f0f0;
  color: #333;
}

.back-btn:hover {
  background-color: #ddd;
}
</style>