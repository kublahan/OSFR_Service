<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/auth';
import RichTextEditor from '@/components/RichTextEditor.vue';

export default defineComponent({
  name: 'InstructionFormView',
  components: {
    RichTextEditor,
  },
  props: {
    id: {
      type: [String, Number],
      default: null,
    },
  },
  setup(props) {
    const router = useRouter();
    const title = ref('');
    const content = ref('');
    const isEditing = ref(false);
    const richTextEditorRef = ref<InstanceType<typeof RichTextEditor> | null>(null);
    const isLoading = ref(true);

    const INSTRUCTION_CATEGORY_ID = 5;

    const fetchInstruction = async () => {
      try {
        isLoading.value = true;
        const response = await api.get(`/admin/instructions/${props.id}`);
        title.value = response.data.title;
        content.value = response.data.content;
      } catch (error) {
        console.error('Ошибка при загрузке инструкции:', error);
        title.value = '';
        content.value = '';
      } finally {
        isLoading.value = false;
      }
    };

    const submitForm = async () => {
      let finalContent = content.value;
      if (richTextEditorRef.value) {

        finalContent = await richTextEditorRef.value.handleSave(content.value);
      }

      const payload = {
        title: title.value,
        content: finalContent,
        category_id: Number(INSTRUCTION_CATEGORY_ID),
      };

      try {
        if (isEditing.value) {
          await api.put(`/admin/instructions/${props.id}`, payload);
        } else {
          await api.post('/admin/instructions', payload);
        }
        router.push({ name: 'admin' });
      } catch (error) {
        console.error('Ошибка при сохранении инструкции:', error);
      }
    };

    watch(() => props.id, (newId) => {
      isEditing.value = !!newId;
      if (newId) {
        fetchInstruction();
      } else {
        title.value = '';
        content.value = '';
        isLoading.value = false;
      }
    }, { immediate: true });

    return {
      title,
      content,
      isEditing,
      submitForm,
      richTextEditorRef,
      isLoading,
    };
  },
});
</script>

<template>
  <div class="page-wrapper">
    <header class="page-header">
      <div class="title">{{ isEditing ? 'Редактировать инструкцию' : 'Добавить инструкцию' }}</div>
      <button class="back-btn" @click="$router.push({ name: 'admin' })">Назад</button>
    </header>

    <main class="main-content">
      <div class="instruction-form-container">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="instruction-title">Заголовок</label>
            <input id="instruction-title" v-model="title" type="text" required class="form-input" />
          </div>
          <div class="form-group">
            <label for="instruction-content">Содержание</label>
            <div v-if="isLoading" class="loading-message">Загрузка...</div>
            <RichTextEditor v-else ref="richTextEditorRef" v-model="content" />
          </div>
          <div class="form-actions">
            <button type="submit" class="save-button" :disabled="isLoading">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #D6E9FD;
  overflow-x: hidden;
}

.page-header {
  width: 100%;
  height: 7.5rem;
  background: linear-gradient(to right, #0983FE 12%, #124AA7 41%, #1A185C 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px;
  box-sizing: border-box;
}

.page-header .title {
  font-size: 3rem;
  font-family: 'Lato-SemiBold';
  text-align: center;
  flex-grow: 1;
  margin: 0 auto;
}

.main-content {
  display: flex;
  justify-content: center;
  padding: 50px 0;
  flex-grow: 1;
}

.back-btn {
  background-color: transparent;
  color: #fff;
  border: 1px solid #fff;
  border-radius: 10px;
  font-family: 'Inter-Regular';
  font-size: 24px;
  height: 2.6875rem;
  width: 9.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}


.instruction-form-container {
  max-width: 1000px;
  margin: 40px auto;
  padding: 30px;
  background-color: #f8f8f8;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.instruction-form-container h1 {
  text-align: center;
  color: #1a185c;
  margin-bottom: 20px;
  font-size: 2.5rem;
  font-family: 'Lato-SemiBold';
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 10px 15px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.save-button, .cancel-button {
  padding: 10px 25px;
  font-size: 1.1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-button {
  background-color: #1150B0;
  color: #fff;
}

.save-button:hover {
  background-color: #0d408f;
}

.cancel-button {
  background-color: #ccc;
  color: #333;
}

.cancel-button:hover {
  background-color: #bbb;
}

.instruction-form-container :deep(.quill-editor-custom) {
  max-width: none;
  margin: 0;
  padding: 0;
}
</style>