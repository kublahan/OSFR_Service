<template>
  <div class="edit-page-container">
    <header class="edit-page-header">
      <div class="title">{{ isEditing ? 'Редактировать ПО' : 'Добавить ПО' }}</div>
      <div class="admin-info">Админ</div>
    </header>

    <main class="form-card">
      <div class="form-container">
        <img src="@/assets/icons/Logo_OSFR.svg" alt="Logo" class="Logo-img"></img>
        <form @submit.prevent="saveSoftware">
          <div class="form-group">
            <label for="name">Наименование</label>
            <input type="text" id="name" v-model="software.name" required>
          </div>

          <div class="form-group">
            <label for="description">Описание</label>
            <textarea id="description" v-model="software.description"></textarea>
          </div>

          <div class="file-drop">
              <div class="file-drop-area"
               @dragover.prevent @drop="handleFileDrop"
               @click="openFilePicker">
            <p>Перетащите файл сюда или нажмите, чтобы загрузить</p>
            <p v-if="software.file" class="file-name">{{ software.file.name }}</p>
            <input type="file" ref="fileInput" @change="handleFileChange" style="display: none" />
          </div>
          </div>
        
        </form>
      </div>
    </main>

    <div class="form-actions">
      <button type="submit" class="save-btn" @click="saveSoftware">Сохранить</button>
      <button type="button" @click="goBack" class="back-btn">Назад</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/api/auth';

interface SoftwareItem {
  id?: number;
  name: string;
  description: string;
  file: File | null;
}

export default defineComponent({
  name: 'SoftwareView',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const isEditing = ref(false);
    const software = ref<SoftwareItem>({
      name: '',
      description: '',
      file: null,
    });

    const fileInput = ref<HTMLInputElement | null>(null);

    const handleFileDrop = (event: DragEvent) => {
      event.preventDefault();
      const files = event.dataTransfer?.files;
      if (files && files.length > 0) {
        software.value.file = files[0];
      }
    };

    const handleFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const files = target.files;
      if (files && files.length > 0) {
        software.value.file = files[0];
      }
    };

    const openFilePicker = () => {
      fileInput.value?.click();
    };

    const saveSoftware = async () => {

      const categoryId = 6;


      if (!software.value.name || !software.value.file) {
        console.error('Пожалуйста, заполните все обязательные поля (наименование и файл).');
        return;
      }

      const formData = new FormData();
      formData.append('name', software.value.name);
      formData.append('description', software.value.description);

      formData.append('category_id', categoryId.toString());
      
      if (software.value.file) {
        formData.append('file', software.value.file);
      }

      try {
        if (isEditing.value && software.value.id) {
          await api.put(`/admin/software/${software.value.id}`, formData);
        } else {
          await api.post('/admin/software', formData);
        }
        router.push({ name: 'admin' });
      } catch (error) {
        console.error('Ошибка при сохранении ПО:', error);
      }
    };

    const goBack = () => {
      router.back();
    };

    onMounted(async () => {
      if (route.params.id) {
        isEditing.value = true;
        try {
          const response = await api.get(`/software/${route.params.id}`);
          const item = response.data;
          software.value = {
            id: item.id,
            name: item.name,
            description: item.description,
            file: null,
          };
        } catch (error) {
          console.error('Ошибка при получении ПО:', error);
        }
      }
    });

    return {
      isEditing,
      software,
      fileInput,
      handleFileDrop,
      handleFileChange,
      openFilePicker,
      saveSoftware,
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
  overflow-y: hidden;
}

.edit-page-header {
  width: 100%;
  height: 7.5rem;
  background: linear-gradient(to right, #0983FE 12%, #124AA7 41%, #1A185C 100%);
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 50px;
  justify-content: space-between;
}

.edit-page-header .title {
  font-size: 3rem;
  font-family: 'Lato-SemiBold';
  margin: 0 auto;
}

.edit-page-header .admin-info {
  font-size: 1.75rem;
  font-family: 'Inter-Regular';
}

.form-card {
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 5px 10px rgba(26, 25, 92, 0.2);
  margin-top: 50px;
  width: 94.688rem;
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.Logo-img {
  height: 54px;
  width: 66px;
  margin-bottom: 25px;
  margin-top: 23px;
}

.form-group {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 43px;
}

.form-group label {
  width: 16.438rem;
  height: 3.9375rem;
  font-size: 1.5rem;
  border-radius: 20px 0 0 20px;
  font-family: 'Inter-Medium';
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #0D6EDE 0%, #073B78 100%);
  margin-bottom: 0;
  flex-shrink: 0;
}

.form-group input,
.form-group textarea {
  width: 63.25rem;
  padding: 10px 15px;
  border: 1px solid #0B56AD;
  border-radius: 0 20px 20px 0;
  font-size: 1.5rem;
  font-family: 'Inter-Light';
  background-color: #EFEFEF;
  height: 3.9375rem;
  resize: none;
  box-sizing: border-box;
}


.file-drop-area {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 46.125rem;
  height: 15.5rem;
  border: 2px dashed #1150B0;
  border-radius: 20px;
  cursor: pointer;
  background-color: #EDF6FF;
  color: #1A185C;
  font-family: 'Inter-Regular';
  font-size: 1.5rem;
  padding: 20px;
  text-align: center;
}
.file-drop {
  display: flex;
  justify-content: center;
  margin-bottom: 54px;
}

.file-drop-area p {
  margin: 0;
}

.file-drop-area .file-name {
  margin-top: 10px;
  font-weight: bold;
}

.form-actions {
  display: flex;
  margin-top: 3.0625rem;
  margin-bottom: 3.3875rem;
  width: 120rem;
  align-items: center;
}

.save-btn, .back-btn {
  cursor: pointer;
  transition: all 0.3s;
}

.save-btn {
  background-color: #1150B0;
  color: #fff;
  width: 17.9375rem;
  margin-left: 51rem;
  border-radius: 20px;
  height: 3.75rem;
  font-size: 28px;
  font-family: 'Inter-Medium';
  border: none;
}

.save-btn:hover {
  background-color: #0d3a82;
}

.back-btn {
  background-color: transparent;
  color: #333;
  margin-left: 28.9375rem;
  color: #124AA7;
  border-radius: 10px;
  font-family: 'Inter-Regular';
  font-size: 24px;
  border: 1px solid #0D6BDA;
  height: 2.6875rem;
  width: 9.5rem;
}

.back-btn:hover {
  background-color: #ddd;
}
</style>