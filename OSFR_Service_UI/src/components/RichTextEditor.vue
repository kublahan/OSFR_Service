<template>
  <div class="editor-container">
    <QuillEditor
      ref="quillEditor"
      v-model:content="content" 
      contentType="html"
      :options="editorOptions"
      @ready="onReady"
      class="quill-editor-custom"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onUnmounted } from 'vue';
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
    const pendingImages = ref(new Map<string, File>());
    const blobUrls = ref(new Set<string>());
    
    const apiUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';

    const getImagesFromQuill = (quillInstance: any): Set<string> => {
      if (!quillInstance) return new Set();
      const images = quillInstance.root.querySelectorAll('img');
      return new Set(Array.from(images).map(img => img.getAttribute('src') || ''));
    };

    const deleteImageFromServer = async (imageUrl: string) => {
      try {
        if (!token) throw new Error('Пользователь не авторизован');
        
        const response = await fetch(`${apiUrl}/api/admin/delete-image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ url: imageUrl }),
        });
        
        if (!response.ok) {
          console.error('Не удалось удалить файл на сервере:', response.statusText);
        } else {
          console.log('Файл успешно удален:', imageUrl);
        }
      } catch (error) {
        console.error('Ошибка при удалении изображения:', error);
      }
    };
    
    const uploadImagesAndGetUrls = async () => {
      const tempToPermanentUrls = new Map<string, string>();
      const uploadPromises: Promise<void>[] = [];
    
      pendingImages.value.forEach((file, tempUrl) => {
        uploadPromises.push(
          (async () => {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`${apiUrl}/api/admin/upload-image`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` },
              body: formData,
            });

            if (!response.ok) throw new Error('Ошибка загрузки');

            const { url: permanentUrl } = await response.json();
            tempToPermanentUrls.set(tempUrl, permanentUrl);
          })()
        );
      });
      await Promise.all(uploadPromises);
      return tempToPermanentUrls;
    };
    
    const handleSave = async (contentToSave: string) => {
      const tempToPermanentUrls = await uploadImagesAndGetUrls();
      
      let finalContent = contentToSave;
      tempToPermanentUrls.forEach((permanentUrl, tempUrl) => {
        finalContent = finalContent.replace(new RegExp(tempUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), permanentUrl);
      });

      const parser = new DOMParser();
      const doc = parser.parseFromString(finalContent, 'text/html');
      const images = doc.querySelectorAll('img');
      const currentImageUrls = new Set(Array.from(images).map(img => img.getAttribute('src') || ''));
      
      const imagesToDelete = new Set<string>();

      initialImageUrls.value.forEach(url => {
        if (!currentImageUrls.has(url)) {
          imagesToDelete.add(url);
        }
      });
      
      const deletePromises = Array.from(imagesToDelete).map(url => deleteImageFromServer(url));
      await Promise.all(deletePromises);
      
      pendingImages.value.clear();
      blobUrls.value.forEach(url => URL.revokeObjectURL(url));
      blobUrls.value.clear();
      
      initialImageUrls.value = currentImageUrls;

      return finalContent;
    };

    const imageHandler = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
          const base64Url = reader.result as string;

          const quill = quillEditor.value?.getQuill();
          if (quill) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', base64Url);
            quill.setSelection(range.index + 1);
            pendingImages.value.set(base64Url, file);
          }
        };
        reader.readAsDataURL(file);
      };
      input.click();
    };

    onUnmounted(() => {
      blobUrls.value.forEach(url => URL.revokeObjectURL(url));
    });

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

    };
    
    watch(() => props.modelValue, (newValue) => {
      if (newValue !== content.value) {
        content.value = newValue;
      }
    }, { immediate: true });

    const onReady = (quillInstance: any) => {
      initialImageUrls.value = getImagesFromQuill(quillInstance);
    };

    watch(content, (newValue) => {
      emit('update:modelValue', newValue);
    });
    
    return {
      content,
      editorOptions,
      quillEditor,
      handleSave,
      onReady,
    };
  },
});
</script>

<style>

@import '@/styles/InstructionsStyles.css';


.editor-container {
  max-width: 1200px;
  margin: 20px auto;
  background-color: #f0f0f0;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  padding: 20px;
  box-sizing: border-box;
}


.quill-editor-custom .ql-editor {
  width: 210mm;
  min-height: 297mm;
  padding: 20mm;
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}


.ql-toolbar.ql-snow {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #D6E9FD;
  border: 1px solid #c9dff7;
  border-radius: 8px 8px 0 0;
  padding: 12px 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}


.ql-toolbar button,
.ql-toolbar .ql-picker {
  border: none !important;
  background-color: transparent !important;
  transition: all 0.2s ease;
  padding: 8px;
  border-radius: 4px;
}

.ql-toolbar button:hover,
.ql-toolbar .ql-picker:hover {
  background-color: rgba(0, 0, 0, 0.08) !important;
}

.ql-toolbar button.ql-active,
.ql-toolbar .ql-picker.ql-active {
  background-color: #1a185c !important;
  color: #fff !important;
  transform: none;
}

.ql-toolbar svg {
  width: 20px;
  height: 20px;
}


.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before { content: '12px'; }
.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before { content: '16px'; }
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before { content: '20px'; }
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before { content: '24px'; }


.ql-container.ql-snow {
  border: none;
  font-family: 'Inter-Regular', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
}
</style>