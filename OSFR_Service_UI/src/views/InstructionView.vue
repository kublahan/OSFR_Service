<script lang="ts">
import { defineComponent, ref } from 'vue';
import api from '@/api/auth';
import { useRoute } from 'vue-router';

interface InstructionItem {
    id: number | string;
    title: string;
    content: string;
}

export default defineComponent({
    name: 'InstructionView',
    setup() {
        const route = useRoute();
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

        fetchInstruction();

        return {
            instruction,
            errorMessage,
        };
    },
});
</script>

<template>
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
</template>

<style scoped>
.instruction-view-container {
    max-width: 800px;
    margin: 40px auto;
    padding: 30px;
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

.instruction-content {
    line-height: 1.6;
    font-size: 1rem;
    color: #333;
}

.instruction-content img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 20px auto;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.error-message, .loading-message {
    text-align: center;
    padding: 20px;
    color: #cc0000;
}
</style>
