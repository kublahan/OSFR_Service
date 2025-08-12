<script lang="ts">
import { defineComponent, type PropType } from 'vue';

interface ButtonItem {
    id: number | string;
    category_id: number | string;
    category_name?: string;
    name: string;
    service: string | null;
    url: string | null;
    type: 'resource' | 'instruction' | 'software';
}

export default defineComponent({
    name: 'ResourcesButton',
    props: {
        item: {
            type: Object as PropType<ButtonItem>,
            required: true,
        },
    },
    emits: ['action'],
    setup(props, { emit }) {
        const handleAction = () => {
            // Просто испускаем событие с полным объектом item
            emit('action', props.item);
        };
        return {
            handleAction,
        };
    },
});
</script>

<template>
    <div class="main-container" @click="handleAction">
        <div class="content-wrapper">
            <div class="name-item">{{ item.name }}</div>
            <div class="name-serv">{{ item.service || '—' }}</div>
            <div class="action-btn">
                <span v-if="item.type === 'software'">Скачать</span>
                <span v-else-if="item.type === 'instruction'">Просмотреть</span>
                <span v-else>Открыть</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.main-container {
    display: block;
    width: 21rem;
    height: 11.25rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    padding: 1.5625rem;
    background: white;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
    cursor: pointer;
}

.main-container:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    background: #D6E9FD;
}

.content-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.name-item {
    font-size: 1.375rem;
    margin-bottom: 0.5rem;
    font-family: 'Inter-Regular';
    color: #000000;
    word-break: break-word;
}

.name-serv {
    font-size: 1rem;
    color: #666;
    margin-bottom: 1rem;
    word-break: break-word;
}

.action-btn {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: linear-gradient(to right, #105CC3 0%, #105CC3 100%);
    color: #FFFFFF;
    border-radius: 0.5rem;
    text-align: center;
    width: fit-content;
    align-self: flex-end;
}



@media (max-width: 1200px) {
    .main-container {
        width: 18rem;
        height: 10rem;
    }
    .name-item {
        font-size: 1.2rem;
    }
    .name-serv {
        font-size: 0.9rem;
    }
}

@media (max-width: 768px) {
    .main-container {
        width: 100%;
        height: auto;
    }
    .name-item {
        font-size: 1.1rem;
    }
    .name-serv {
        font-size: 0.8rem;
    }
}
</style>