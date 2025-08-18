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


const BlockEmbed = Quill.import('blots/block/embed');
class ImageBlot extends BlockEmbed {
  static blotName = 'image';
  static tagName = 'img';
  static className = 'custom-image';

  static create(value: any) {
    const node = super.create();
    if (typeof value === 'object') {
      node.setAttribute('src', value.src);
      if (value.align) {
        node.style.display = 'block';
        node.style.margin = '0 auto';
      }
    } else {
      node.setAttribute('src', value);
    }
    node.style.display = 'block';
    node.style.margin = '0 auto';
    return node;
  }

  static value(node: any) {
    return {
      src: node.getAttribute('src'),
      align: node.getAttribute('class')
    };
  }
}

ImageBlot.allowedFormats = ['align'];
Quill.register(ImageBlot, true);

const Font = Quill.import('formats/font');
Font.whitelist = ['times-new-roman', 'sans-serif'];
Quill.register(Font, true);

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
          console.error('Ошибка удаления изображения:', response.statusText);
        } else {
          console.log('Изображение успешно удалено:', imageUrl);
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
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': ['times-new-roman'] }],
            [{ 'color': [] }, { 'background': [] }],
            ['image'],
            [{ 'align': [] }], 
            ['clean']
          ],
          handlers: {
            'image': imageHandler
          }
        },
        imageResize: {
          parchment: Quill.import('parchment'),
          modules: ['Resize', 'DisplaySize', 'Toolbar']
        },
        keyboard: {
          bindings: {
            'space': {
              key: ' ',
              handler: function(range, context) {
                const formats = this.quill.getFormat(range.index - 1); 
                this.quill.insertText(range.index, '\u00a0', formats);
                this.quill.setSelection(range.index + 1);
                return false;
              }
            }
          }
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
.quill-editor-custom {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}


.ql-editor, .instruction-content {
  max-width: 800px;
  padding: 30px;
  box-sizing: border-box;
  word-wrap: break-word;
  word-break: break-word;
  font-family: "Times New Roman", Times, serif;
  font-size: 16px;
  line-height: 1.6;
}

.ql-container.ql-snow {
  border: none;
}

.ql-editor h1, .instruction-content h1,
.ql-editor h2, .instruction-content h2,
.ql-editor h3, .instruction-content h3 {
  font-family: 'Lato-SemiBold', sans-serif;
  color: #1a185c;
  margin-bottom: 0.5em;
}

.ql-editor h1, .instruction-content h1 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.ql-editor h2, .instruction-content h2 {
  font-size: 2em;
}

.ql-editor h3, .instruction-content h3 {
  font-size: 1.5em;
}

.ql-editor p, .instruction-content p {
  line-height: 1.6;
  font-size: 1rem;
  color: #333;
}


.ql-editor .ql-size-small, .instruction-content .ql-size-small {
  font-size: 0.75rem;
}

.ql-editor .ql-size-large, .instruction-content .ql-size-large {
  font-size: 1.5rem;
}

.ql-editor .ql-size-huge, .instruction-content .ql-size-huge {
  font-size: 2.5rem;
}


.ql-editor img, .instruction-content img {
  max-width: 100%;
  height: auto;
  display: block;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.ql-editor .custom-image {
  margin: 20px auto;
}

.ql-editor .ql-align-left .custom-image {
  margin-left: 0;
  margin-right: auto;
}

.ql-editor .ql-align-center .custom-image {
  margin: 20px auto;
}

.ql-editor .ql-align-right .custom-image {
  margin-left: auto;
  margin-right: 0;
}


.ql-editor a, .instruction-content a {
  color: #1150B0;
  text-decoration: underline;
}

.ql-editor ul, .instruction-content ul,
.ql-editor ol, .instruction-content ol {
  padding-left: 2em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}


.ql-editor .ql-align-center, .instruction-content .ql-align-center {
  text-align: center;
}
.ql-editor .ql-align-right, .instruction-content .ql-align-right {
  text-align: right;
}
.ql-editor .ql-align-justify, .instruction-content .ql-align-justify {
  text-align: justify;
}


.ql-toolbar.ql-snow {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #fff;
  border: 1px solid #c9dff7;
  border-radius: 8px 8px 0 0;
  padding: 12px 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}


.ql-toolbar button, 
.ql-toolbar .ql-picker,
.ql-toolbar .ql-formats {
  height: 30px;
  display: inline-flex;

  align-items: center;
  border: none !important;
  background-color: transparent !important;
  transition: all 0.2s ease;
  border-radius: 4px;
  padding: 0;

}


.ql-toolbar button:hover, 
.ql-toolbar .ql-picker:hover {
  background-color: rgba(0, 0, 0, 0.08) !important;
  transform: scale(1.05);
}

.ql-toolbar button.ql-active, 
.ql-toolbar .ql-picker.ql-active {
  background-color: #007bff !important;
  color: #fff !important;
  transform: none;
}


.ql-toolbar svg {
  width: 20px;
  height: 20px;
  stroke: #444;
}

.ql-toolbar button.ql-active svg {
  stroke: #fff;
}


.ql-snow .ql-picker-label {
  font-size: 14px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: 4px;
  height: 100%;
}

.ql-snow .ql-picker-label::before {
  line-height: 1.2;
}


.ql-snow .ql-picker-options {
  background-color: #fff;
  border: 1px solid #c9dff7;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 8px 0;
}

.ql-snow .ql-picker-item:hover {
  background-color: #e6f2ff;
}


.ql-font-times-new-roman { font-family: "Times New Roman", Times, serif; }

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="times-new-roman"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="times-new-roman"]::before { content: 'Times New Roman'; }

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before, .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before { content: '12px'; }
.ql-snow .ql-picker.ql-size .ql-picker-label::before, .ql-snow .ql-picker.ql-size .ql-picker-item::before { content: '16px'; }
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before, .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before { content: '20px'; }
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before, .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before { content: '24px'; }
</style>
