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


    /**
     * Извлекает все URL-адреса изображений из текущего содержимого Quill.
     * @param quillInstance Экземпляр Quill.
     * @returns Набор URL-адресов изображений.
     */
    const getImagesFromQuill = (quillInstance: any): Set<string> => {
      if (!quillInstance) return new Set();
      const images = quillInstance.root.querySelectorAll('img');
      return new Set(Array.from(images).map(img => img.getAttribute('src') || ''));
    };

    /**
     * Отправляет запрос на сервер для удаления изображения.
     * @param imageUrl URL-адрес изображения для удаления.
     */
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
    
    /**
     * Загружает все ожидающие изображения на сервер.
     * @returns Map, сопоставляющую временные URL с постоянными URL с сервера.
     */
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
    
    /**
     * Обрабатывает сохранение содержимого редактора.
     * Загружает новые изображения, заменяет временные URL на постоянные и удаляет ненужные изображения.
     * @param contentToSave HTML-содержимое редактора.
     * @returns Итоговое содержимое с постоянными URL-адресами.
     */
    const handleSave = async (contentToSave: string) => {
      // Загружаем новые изображения и получаем их URL
      const tempToPermanentUrls = await uploadImagesAndGetUrls();
      
      let finalContent = contentToSave;
      // Заменяем временные URL на постоянные в HTML-содержимом
      tempToPermanentUrls.forEach((permanentUrl, tempUrl) => {
        finalContent = finalContent.replace(new RegExp(tempUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), permanentUrl);
      });

      // Получаем список текущих URL из ОБНОВЛЕННОЙ строки HTML
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
      
      // Очистка временных ресурсов
      pendingImages.value.clear();
      blobUrls.value.forEach(url => URL.revokeObjectURL(url));
      blobUrls.value.clear();
      
      // Обновляем список "начальных" URL-адресов для следующей сессии редактирования
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
            // Вставляем Base64-строку в редактор для мгновенного отображения.
            quill.insertEmbed(range.index, 'image', base64Url);
            quill.setSelection(range.index + 1);

            // Сохраняем файл с Base64-строкой в качестве ключа для последующей загрузки на сервер.
            pendingImages.value.set(base64Url, file);
          }
        };
        reader.readAsDataURL(file);
      };
      input.click();
    };

    // Очистка временных URL при уничтожении компонента (хотя для Base64 это не так критично, как для blob:).
    onUnmounted(() => {
      blobUrls.value.forEach(url => URL.revokeObjectURL(url));
    });

    // Настройки редактора Quill
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
            'image': imageHandler // Привязываем наш обработчик к кнопке "Изображение"
          }
        },
        imageResize: {
          parchment: Quill.import('parchment'),
          modules: ['Resize', 'DisplaySize', 'Toolbar']
        }
      },
      placeholder: 'Начните писать здесь...',
    };
    
    // Отслеживаем изменения props.modelValue для обновления содержимого редактора
    watch(() => props.modelValue, (newValue) => {
      if (newValue !== content.value) {
        content.value = newValue;
      }
    }, { immediate: true });

    // Устанавливаем начальные URL-адреса изображений после загрузки Quill
    const onReady = (quillInstance: any) => {
      initialImageUrls.value = getImagesFromQuill(quillInstance);
    };

    // Отслеживаем изменения содержимого Quill и отправляем их в родительский компонент
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
