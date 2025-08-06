<template>
  <div class="edit-page-container">
    <header class="edit-page-header">
      <div class="title">{{ isEditMode ? 'Редактирование ресурса' : 'Добавление ресурса' }}</div>
      <div class="admin-info">Админ</div>
    </header>

    <main class="form-card">
      <div class="form-container">

        
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name">Наименование</label>
            <input type="text" id="name" v-model="formData.name" required>
          </div>
          
          <div class="form-group">
            <label for="service">Сервис</label>
            <input type="text" id="service" v-model="formData.service" required>
          </div>
          
          <div class="form-group">
            <label for="url">Ссылка</label>
            <input type="url" id="url" v-model="formData.url" required>
          </div>
          
          <div class="form-group">
            <label for="category">Выберите категорию</label>
            <select id="category" v-model="formData.category_id" required>
              <option value="" disabled>Выберите категорию</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
            </select>
          </div>

          <div class="form-actions">
            <button type="submit" class="save-btn">Сохранить</button>
            <button type="button" @click="goBack" class="back-btn">Назад</button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/auth';


interface Category {
  id: number | string;
  name: string;
}


interface FormData {
  name: string;
  service: string;
  url: string;
  category_id: number | string | null;
}

export default defineComponent({
  name: 'ResourcesEditView',
  props: {
    id: {
      type: [String, Number],
      required: false,
    },
  },
  setup(props) {
    const router = useRouter();


    const isEditMode = computed(() => !!props.id); 
    

    const formData = ref<FormData>({
      name: '',
      service: '',
      url: '',
      category_id: null,
    });


    const categories = ref<Category[]>([]);


    const fetchCategories = async () => {
      try {
        const response = await api.get<Category[]>(`/categories`);
        categories.value = response.data;
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
      }
    };


    const fetchResourceData = async (id: number | string) => {
      try {
        const response = await api.get<any>(`/admin/resources/${id}`);
        const resource = response.data;
        formData.value = {
          name: resource.name,
          service: resource.service,
          url: resource.url,
          category_id: resource.category_id,
        };
      } catch (error) {
        console.error(`Ошибка при загрузке данных ресурса с ID ${id}:`, error);
      }
    };


    const submitForm = async () => {
      try {
        if (isEditMode.value) {

          await api.put(`/admin/resources/${props.id}`, formData.value);
          console.log('Ресурс успешно обновлен');
        } else {

          await api.post(`/admin/resources`, formData.value);
          console.log('Ресурс успешно добавлен');
        }

        router.push({ name: 'admin' });
      } catch (error) {
        console.error('Ошибка при сохранении ресурса:', error);
      }
    };


    const goBack = () => {
      router.go(-1);
    };


    onMounted(async () => {
      await fetchCategories();

      if (isEditMode.value) {
        await fetchResourceData(props.id);
      }
    });


    watch(() => props.id, (newId) => {
      if (newId) {
        fetchResourceData(newId);
      } else {

        formData.value = {
          name: '',
          service: '',
          url: '',
          category_id: null,
        };
      }
    });


    return {
      isEditMode,
      formData,
      categories,
      submitForm,
      goBack,
    };
  },
});
</script>

<style scoped>
.edit-page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f4f9;
}

.edit-page-header {
  width: 100%;
  height: 90px;
  background: linear-gradient(to right, #0983FE 12%, #124AA7 41%, #1A185C 100%);
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
}

.edit-page-header .title {
  font-size: 2.5rem;
  font-family: 'Lato-SemiBold';
}

.edit-page-header .admin-info {
  font-size: 1.5rem;
  font-family: 'Inter-Regular';
}

.form-card {
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 40px;
  margin-top: 50px;
  width: 90%;
  max-width: 700px;
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-logo {
  width: 80px;
  margin-bottom: 20px;
}

.form-group {
  width: 100%;
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 1.5rem;
  color: #1A185C;
  margin-bottom: 5px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1.25rem;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.save-btn, .back-btn {
  padding: 10px 30px;
  border: none;
  border-radius: 5px;
  font-size: 1.5rem;
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