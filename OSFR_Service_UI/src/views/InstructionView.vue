<script lang="ts">
import { defineComponent, ref } from 'vue';
import api from '@/api/auth';
import { useRoute, useRouter } from 'vue-router';

interface InstructionItem {
    id: number | string;
    title: string;
    content: string;
}

export default defineComponent({
    name: 'InstructionView',
    setup() {
        const route = useRoute();
        const router = useRouter();
        const instruction = ref<InstructionItem | null>(null);
        const errorMessage = ref('');

        const fetchInstruction = async () => {
            try {
                const response = await api.get<InstructionItem>(`/admin/instructions/${route.params.id}`);
                instruction.value = response.data;
            } catch (error) {
                console.error('Error fetching instruction:', error);
                errorMessage.value = 'Ошибка при загрузке инструкции.';
            }
        };

        const goBack = () => {
            router.back();
        };

        fetchInstruction();

        return {
            instruction,
            errorMessage,
            goBack,
        };
    },
});
</script>

<template>
    <div class="page-wrapper">
        <header class="page-header">
            <div class="title">Просмотри инструкции</div>
            <button class="back-btn" @click="goBack">Назад</button>
        </header>

        <main class="main-content">
            <div class="instruction-view-container">
                <template v-if="instruction">
                    <h1>{{ instruction.title }}</h1>
                    <div class="instruction-content" v-html="instruction.content"></div>
                </template>
                <div v-else-if="errorMessage" class="error-message">
                    <p>{{ errorMessage }}</p>
                </div>
                <div v-else class="loading-message">
                    <p>Загрузка...</p>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
@import '@/styles/InstructionsStyles.css';
@import 'quill/dist/quill.snow.css';

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
  justify-content: center;
  box-sizing: border-box;
  
}

.page-header .title {
  font-size: 3rem;
  font-family: 'Lato-SemiBold';
  text-align: center;
  flex-grow: 1;
}

.main-content {
  display: flex;
  justify-content: center;
  padding: 50px 0;
}


.instruction-view-container {
  width: 210mm;
  min-height: 297mm;
  margin: 0;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

}


.instruction-view-container h1 {
  text-align: center;
  color: #1a185c;
  margin-bottom: 20px;
  font-size: 2.5rem;
  font-family: 'Lato-SemiBold';
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
  margin-right: 50px;
}

.back-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}


.instruction-content {
  line-height: 1.6;
  font-family: "Times New Roman", Times, serif; 
  font-size: 16px;
  color: #333;
  padding: 30px;
}


.instruction-content :deep(h1),
.instruction-content :deep(h2),
.instruction-content :deep(h3),
.instruction-content :deep(h4),
.instruction-content :deep(h5),
.instruction-content :deep(h6) {
    font-family: 'Lato-SemiBold', sans-serif;
    color: #1a185c;
    margin-bottom: 0.5em;
    font-size: 1.5em;
}

.instruction-content :deep(h1) {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 20px;
}

.instruction-content :deep(h2) {
    font-size: 2em;
}

.instruction-content :deep(h3) {
    font-size: 1.5em;
}

.instruction-content :deep(h4) {
    font-size: 1.25em;
}

.instruction-content :deep(h5) {
    font-size: 1.1em;
}

.instruction-content :deep(h6) {
    font-size: 1em;
}


.instruction-content :deep(.ql-size-small) { font-size: 0.75rem; }
.instruction-content :deep(.ql-size-large) { font-size: 1.5rem; }
.instruction-content :deep(.ql-size-huge) { font-size: 2.5rem; }
.instruction-content :deep(.ql-editor) { font-size: 16px; }



.instruction-content :deep(.ql-align-center) {
    text-align: center;
}

.instruction-content :deep(.ql-align-right) {
    text-align: right;
}

.instruction-content :deep(.ql-align-justify) {
    text-align: justify;
}

.instruction-content :deep(.ql-align-left) {
    text-align: left;
}



.instruction-content :deep(img) {
  display: inline-block;
  vertical-align: middle;
  max-width: 100%;
  height: auto;
  margin: 20px auto;
}


.instruction-content :deep(.ql-align-left) img {
    margin-left: 0;
    margin-right: auto;
}

.instruction-content :deep(.ql-align-right) img {
    margin-left: auto;
    margin-right: 0;
}

.instruction-content :deep(.ql-align-center) img {
    margin-left: auto;
    margin-right: auto;
}

.instruction-content :deep(p) {
  margin: 0;
  line-height: 1.6;
}

.instruction-content :deep(.ql-indent-1) {
  margin-left: 3em;
}

.instruction-content :deep(.ql-indent-2) {
  margin-left: 6em;
}


.instruction-content :deep(.ql-font-times-new-roman) {
  font-family: "Times New Roman", Times, serif;
}

.error-message, .loading-message {
  text-align: center;
  padding: 20px;
  color: #cc0000;
}
</style>
