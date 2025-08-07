<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue';
import { QuillEditor, Quill } from '@vueup/vue-quill';
import 'quill/dist/quill.snow.css';


import { ImageResize } from 'quill-image-resize-module-ts';


Quill.register('modules/imageResize', ImageResize, true);

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
    const quillEditor = ref<InstanceType<typeof QuillEditor> | null>(null);
    const initialImageUrls = ref(new Set<string>());
    const token = localStorage.getItem('adminToken');


    const onReady = (quillInstance: any) => {
        Quill.register('modules/imageResize', ImageResize, true);
        console.log("Quill is ready, module registered!");
        const getImagesFromQuill = () => {
            const images = quillInstance.root.querySelectorAll('img');
            return new Set(Array.from(images).map(img => img.getAttribute('src') || ''));
        };

        initialImageUrls.value = getImagesFromQuill();

        quillInstance.on('text-change', () => {
            const currentImageUrls = getImagesFromQuill();
            
            initialImageUrls.value.forEach(url => {
                if (!currentImageUrls.has(url)) {
                    deleteImageFromServer(url);
                }
            });

            initialImageUrls.value = currentImageUrls;
        });
    };


    const deleteImageFromServer = async (imageUrl: string) => {
      try {
        if (!token) throw new Error('Пользователь не авторизован');

        const response = await fetch('http://localhost:3000/api/admin/delete-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ url: imageUrl }),
        });

        if (!response.ok) {
          console.error('Не удалось удалить файл на сервере');
        }
      } catch (error) {
        console.error('Ошибка при удалении изображения:', error);
      }
    };

    onMounted(() => {
      Quill.register('modules/imageResize', ImageResize, true);
      const quill = quillEditor.value?.getQuill();
      if (!quill) return;

      const getImagesFromQuill = () => {
        const images = quill.root.querySelectorAll('img');
        return new Set(Array.from(images).map(img => img.getAttribute('src') || ''));
      };

      initialImageUrls.value = getImagesFromQuill();

      quill.on('text-change', () => {
        const currentImageUrls = getImagesFromQuill();
        
        initialImageUrls.value.forEach(url => {
          if (!currentImageUrls.has(url)) {
            deleteImageFromServer(url);
          }
        });

        initialImageUrls.value = currentImageUrls;
      });
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

          const response = await fetch('http://localhost:3000/api/admin/upload-image', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData,
          });

          if (!response.ok) throw new Error('Ошибка загрузки');

          const { url } = await response.json();
          const quill = quillEditor.value?.getQuill();
          
          if (quill) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', url);
            quill.setSelection(range.index + 1);
          }
        } catch (error) {
          console.error('Ошибка загрузки изображения:', error);
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
        },
        imageResize: {
          parchment: Quill.import('parchment'),
          modules: ['Resize', 'DisplaySize', 'Toolbar']
        }
      },
      placeholder: 'Начните писать здесь...',
    };

    watch(() => props.modelValue, (newValue) => {
      if (newValue !== content.value) {
        content.value = newValue;
      }
    });

    watch(content, (newValue) => {
      emit('update:modelValue', newValue);
    });

    return {
      content,
      editorOptions,
      quillEditor,
      onReady,
    };
  },
});
</script>

<template>
  <div class="editor-container">
    <QuillEditor
      ref="quillEditor"
      v-model:content="content" contentType="html"
      :options="editorOptions"
      @ready="onReady"
      class="quill-editor-custom"
    />
  </div>
</template>


<style>
.editor-container {
  max-width: 1200px;
  margin: 20px auto;
  background-color: #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 20px;
  box-sizing: border-box;
}

.quill-editor-custom {

  width: 210mm;
  min-height: 297mm;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  padding: 20mm;
  box-sizing: border-box;
  border-radius: 5px;
  margin: 0 auto;
}

.ql-toolbar {

  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #D6E9FD;
  border: 1px solid #D6E9FD;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding: 10px;
}

.ql-container {
  border: none;
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