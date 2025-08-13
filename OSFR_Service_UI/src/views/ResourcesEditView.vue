<template>
  <div class="edit-page-container">
    <header class="edit-page-header">
      <div class="title">{{ isEditMode ? 'Настройка ресурса' : 'Добавление ресурса' }}</div>
      <div class="admin-info">Админ</div>
    </header>

    <main class="form-card">
      <div class="form-container">
        <img src="@/assets/icons/Logo_OSFR.svg" alt="Logo" class="Logo-img"></img>
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
          
          <div class="form-group category-dropdown-group">
            <EditCategoryDropdown
              :categories="categories"
              v-model="formData.category_id"
            />
          </div>
        </form>
      </div>
    </main>
    <div class="form-actions">
      <button type="submit" class="save-btn" @click="submitForm">Сохранить</button>
      <button type="button" @click="goBack" class="back-btn">Назад</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/auth';
import EditCategoryDropdown from '@/components/EditCategoryDropdown.vue';


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
  components: {
    EditCategoryDropdown,
  },
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
  background-color: #D6E9FD;
}

.edit-page-header {
  width: 100%;
  height: 7.5rem;
  background: linear-gradient(to right, #0983FE 12%, #124AA7 41%, #1A185C 100%);
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 50px;
  justify-content: right;
}

.edit-page-header .title {
  font-size: 3rem;
  font-family: 'Lato-SemiBold';
  margin-right: 36.938rem;
}

.edit-page-header .admin-info {
  font-size: 1.75rem;
  font-family: 'Inter-Regular';
}

.form-card {
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 5px 10px rgba(26, 25, 92, 0.2);
  padding: 30px;
  margin-top: 50px;
  width: 94.688rem;
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.form-group {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 71px;
}

.form-group label {
  width: 16.438rem;
  height: 3.875rem;
  font-size: 1.5rem;
  border-radius: 20px 0 0 20px;
  font-family: 'Inter-Medium';
  color: white;
  align-items: center;
  display: flex;
  justify-content: center;
  background: linear-gradient(to right, #0D6EDE 0%, #073B78 100%);
  margin-bottom: 0;
}

.form-group input{
  width: 63.25rem;
  height: 3.938rem;
  padding: 10px 15px;
  border: 1px solid #0B56AD;
  border-radius: 0 20px 20px 0;
  font-size: 1.5rem;
  font-family: 'Inter-Light';
  background-color: #EFEFEF;
}

.form-group.category-dropdown-group {
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 71px;
}

.form-group.category-dropdown-group label {
    flex-shrink: 0;
}

.form-group.category-dropdown-group .category-dropdown-wrapper {
    flex-grow: 1;
    width: auto;
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

.Logo-img{
  height: 54px;
  width: 66px;
  margin-bottom: 39px;
}
</style>