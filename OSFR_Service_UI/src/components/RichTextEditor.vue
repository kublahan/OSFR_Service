<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import 'quill/dist/quill.snow.css';

export default defineComponent({
  name: 'RichTextEditor',
  components: {
    QuillEditor,
  },
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const content = ref(props.modelValue);
    const quillEditor = ref(null);

    // Watch для синхронизации внешнего modelValue с внутренним content
    watch(() => props.modelValue, (newValue) => {
      if (newValue !== content.value) {
        content.value = newValue;
      }
    });


    watch(content, (newValue) => {
      emit('update:modelValue', newValue);
    });

  const imageHandler = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('image', file);


      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Пользователь не авторизован');
      }

      const response = await fetch('http://localhost:3000/api/admin/upload-image', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка загрузки');
      }

      const { url } = await response.json();
      
      const quill = quillEditor.value?.getQuill();
      if (quill) {
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', url);
        quill.setSelection(range.index + 1);
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  input.click();
};

    const editorOptions = {
      theme: 'snow',
      modules: {
        toolbar: {
          container: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['clean']
          ],
          handlers: {
            'image': imageHandler
          }
        }
      },
      placeholder: 'Начните писать здесь...',
    };

    return {
      content,
      editorOptions,
      quillEditor,
    };
  },
});
</script>

<template>
  <div class="rich-text-editor">
    <QuillEditor
      ref="quillEditor"
      v-model:content="content" contentType="html"
      :options="editorOptions"
      class="quill-editor-custom"
    />
  </div>
</template>


<style>
.rich-text-editor {
  margin-top: 10px;
  margin-bottom: 20px;
}

.quill-editor-custom {
  min-height: 300px;
  border-radius: 8px;
  overflow: hidden;
}

.ql-toolbar {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: #D6E9FD;
  border: 1px solid #D6E9FD;
  padding: 10px;
}

.ql-container {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border: 1px solid #ddd;
  border-top: none;
  font-family: 'Inter-Regular', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
}

.ql-editor img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 10px auto;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.ql-editor a {
  color: #1150B0;
  text-decoration: underline;
}

.ql-editor h1 { font-size: 2em; margin-bottom: 0.5em; }
.ql-editor h2 { font-size: 1.5em; margin-bottom: 0.5em; }
</style>
