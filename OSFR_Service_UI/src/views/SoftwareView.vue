<template>
  <div class="software-view">
    <h2>{{ isEditing ? 'Редактировать ПО' : 'Добавить ПО' }}</h2>
    <div class="form-container">
      <div class="form-group">
        <label for="name">Наименование</label>
        <input type="text" id="name" v-model="software.name" />
      </div>

      <div class="form-group">
        <label for="description">Описание</label>
        <textarea id="description" v-model="software.description"></textarea>
      </div>



      <div class="file-drop-area"
           @dragover.prevent @drop="handleFileDrop"
           @click="openFilePicker">
        <p>Перетащите файл сюда или нажмите, чтобы загрузить</p>
        <p v-if="software.file">{{ software.file.name }}</p>
        <input type="file" ref="fileInput" @change="handleFileChange" style="display: none" />
      </div>

      <div class="actions">
        <button @click="saveSoftware" class="save-btn">Сохранить</button>
        <button @click="goBack" class="back-btn">Назад</button>
      </div>
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

      const categoryId = 2;


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
.software-view {
  max-width: 800px;
  margin: 50px auto;
  padding: 30px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  color: #1A185C;
  margin-bottom: 30px;
  font-size: 2rem;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  text-align: left;
}

.form-group label {
  display: block;
  font-size: 1.2rem;
  color: #1150B0;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.file-drop-area {
  border: 2px dashed #1150B0;
  border-radius: 10px;
  padding: 40px;
  cursor: pointer;
  background-color: #EDF6FF;
  color: #1A185C;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.save-btn, .back-btn {
  padding: 12px 25px;
  border: none;
  border-radius: 5px;
  font-size: 1.2rem;
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
