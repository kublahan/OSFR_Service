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