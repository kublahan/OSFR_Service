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
  <div class="instruction-form-container">
    <h1>{{ isEditing ? 'Редактировать инструкцию' : 'Добавить инструкцию' }}</h1>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="instruction-title">Заголовок</label>
        <input id="instruction-title" v-model="title" type="text" required class="form-input" />
      </div>
      <div class="form-group">
        <label for="instruction-content">Содержание</label>
        <div v-if="isLoading">Загрузка...</div>
        <RichTextEditor v-else ref="richTextEditorRef" v-model="content" />
      </div>
      <div class="form-actions">
        <button type="submit" class="save-button" :disabled="isLoading">
          Сохранить
        </button>
        <button type="button" @click="$router.push({ name: 'admin' })" class="cancel-button">
          Отмена
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
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