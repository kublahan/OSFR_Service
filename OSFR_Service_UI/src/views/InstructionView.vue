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
            <div class="title">Инструкция</div>
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
}


.instruction-view-container {
    max-width: 800px;
    margin: 0;

    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    width: 210mm;
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
}

.back-btn:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.instruction-content {
    line-height: 1.6;
    font-size: 1.2rem;
    color: #333;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.error-message, .loading-message {
    text-align: center;
    padding: 20px;
    color: #cc0000;
}
</style>