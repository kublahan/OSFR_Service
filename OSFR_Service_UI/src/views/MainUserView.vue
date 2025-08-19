<template>
  <div class="app-container">
    <div class="main-layout">

      <Sidebar 
        :categories="categories"
        @select-category="handleCategorySelect"
      />

      <div class="content-area">
        <div class="search-container">
          <img src="/Logo_OSFR.svg" alt="OSFR Logo" class="logo">
          <SearchInput 
            @search="handleSearch"
            :customWidth="'72.4375rem'"
            :customMarginLeft="'1.8125rem'"
          />
        </div>
        <div class="selected-category">
          <h2>
            {{ getCurrentCategoryName() }}
            <span v-if="searchTerm"> "{{ searchTerm }}"</span>
          </h2>
        </div>
        <div class="resources-grid">
          <ResourcesButton 
            v-for="item in filteredItems" 
            :key="item.id" 
            :item="item"
            @action="handleItemAction"
          />
          <div v-if="filteredItems.length === 0" class="no-data">
            Нет данных для отображения.
          </div>
        </div>
      </div>
    </div>
    <div v-if="showErrorModal" class="modal-overlay">
      <div class="modal-content">
        <p>{{ errorMessage }}</p>
        <div class="modal-actions">
          <button @click="closeErrorModal" class="save-btn">ОК</button>
        </div>
      </div>
    </div>
  </div>

  
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import api from '@/api/auth';
import { useRouter } from 'vue-router';
import Sidebar from '@/components/Sidebar.vue';
import SearchInput from '@/components/SearchInput.vue';
import ResourcesButton from '../components/ResourcesButton.vue';

interface Category {
    id: number | string;
    name: string;
}

interface TableItem {
    id: number | string;
    category_id: number | string;
    category_name?: string;
    name: string;
    service: string | null;
    url: string | null;
    type: 'resource' | 'instruction' | 'software';
    description: string | null; 
}

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';

export default defineComponent({
    name: 'MainUserView',
    components: {
        Sidebar,
        SearchInput,
        ResourcesButton
    },
    setup() {
        const router = useRouter();
        const items = ref<TableItem[]>([]);
        const filteredItems = ref<TableItem[]>([]);
        const categories = ref<{ id: number | string, name: string }[]>([]);
        const searchTerm = ref('');
        const selectedCategory = ref<number | string | null>(null);
        const isMobile = ref(false);


        const showErrorModal = ref(false);
        const errorMessage = ref('');

        const checkMobile = () => {
            isMobile.value = window.innerWidth <= 768;
        };

        onMounted(() => {
            checkMobile();
            window.addEventListener('resize', checkMobile);
        });

        onUnmounted(() => {
            window.removeEventListener('resize', checkMobile);
        });

        const fetchCategories = async () => {
            try {
                const response = await axios.get<Category[]>(`${API_BASE_URL}/api/categories`);
                categories.value = response.data;
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchItems = async () => {
            try {
                const response = await axios.get<TableItem[]>(`${API_BASE_URL}/api/items`);
                items.value = response.data.map((item: any) => ({
                    ...item,
                    category_name: getCategoryName(item.category_id),
                    type: item.type || 'resource',
                    description: item.description || null,
                }));
                applyFilters();
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        const getCategoryName = (categoryId: number | string): string => {
            const category = categories.value.find(c => c.id == categoryId);
            return category ? category.name : `Категория ${categoryId}`;
        };

        const handleSearch = (term: string) => {
            searchTerm.value = term;
            applyFilters();
        };

        const handleCategorySelect = (categoryId: number | string | null) => {
            selectedCategory.value = categoryId;
            applyFilters();
        };

        const applyFilters = () => {
            let result = items.value;
            
            if (selectedCategory.value !== null) {
                result = result.filter(item => item.category_id == selectedCategory.value);
            }
            
            if (searchTerm.value) {
                const term = searchTerm.value.toLowerCase();
                result = result.filter(item => 
                    item.name.toLowerCase().includes(term) || 
                    (item.service && item.service.toLowerCase().includes(term)) ||
                    (item.category_name && item.category_name.toLowerCase().includes(term))
                );
            }
            
            filteredItems.value = result;
        };

        const getCurrentCategoryName = () => {
            if (searchTerm.value) {
                return selectedCategory.value
                    ? `Результаты поиска в ${getCategoryName(selectedCategory.value)}`
                    : 'Результаты поиска';
            }
            return selectedCategory.value
                ? getCategoryName(selectedCategory.value)
                : 'Все категории';
        };

        const handleItemAction = (item: TableItem) => {
            if (item.type === 'resource' && item.url) {
                window.open(item.url, '_blank');
            } else if (item.type === 'instruction') {
                router.push({ name: 'instruction-view', params: { id: item.id } });
            } else if (item.type === 'software') {
                downloadItem(item);
            }
        };

        const downloadItem = async (item: TableItem) => {
            if (item.type !== 'software') return;
            try {
                const response = await api.get<Blob>(`/software/download/${item.id}`, {
                    responseType: 'blob'
                });
                
                let fileName = 'download';
                const contentDisposition = response.headers['content-disposition'];
                if (contentDisposition) {
                    const fileNameMatch = contentDisposition.match(/filename="([^"]+)"/);
                    if (fileNameMatch && fileNameMatch.length > 1) {
                        fileName = decodeURIComponent(fileNameMatch[1]);
                    }
                }

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();

                setTimeout(() => {
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                }, 100);
            } catch (error) {
                console.error('Ошибка при скачивании:', error);
                errorMessage.value = 'Не удалось скачать файл';
                showErrorModal.value = true;
            }
        };
        
        const closeErrorModal = () => {
            showErrorModal.value = false;
            errorMessage.value = '';
        };

        fetchCategories();
        fetchItems();

        return {
            items,
            filteredItems,
            categories,
            searchTerm,
            selectedCategory,
            isMobile,
            handleSearch,
            handleCategorySelect,
            applyFilters,
            getCurrentCategoryName,
            handleItemAction,
            showErrorModal,
            errorMessage,
            closeErrorModal,
        };
    }
});
</script>

<style scoped>
.app-container {
    display: flex;
    flex-direction: column;
    background-color: #f5f5f5;
}

.main-layout {
    display: flex;
    width: 100%;
}


.content-area {
    margin-left: 25.625rem;
    flex-grow: 1;
    padding-bottom: 2rem;
    min-height: 100vh;
}

.search-container {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    margin-top: 2.25rem;
    padding: 0 2.5625rem;
}

.resources-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(19rem, 1fr));
    gap: 1.688rem 2.188rem;
    width: 100%;
    padding: 0 2.5625rem;
}

.logo {
    height: 3.6875rem;
    width: 4.5rem;
    margin-right: 1.8125rem;
}

.selected-category {
    padding: 1rem 2.5625rem;
    margin-bottom: 1rem;
    font-family: 'Inter-Extra-Bold';
    color: #191F66;
}

.selected-category h2 {
    font-size: 2.75rem;
    color: #191F66;
    font-weight: 600;
}

.selected-category span {
    color: #1150B0;
    font-weight: normal;
}

.no-data {
    font-size: 1.5rem;
    text-align: center;
    color: #666;
    width: 100%;
    grid-column: 1 / -1;
}


@media (max-width: 1200px) {
    .sidebar {
        width: 20rem;
    }
    .content-area {
        margin-left: 20rem;
    }
    .search-container {
        flex-direction: column;
        align-items: flex-start;
        padding-right: 0;
    }
    .search-container > * {
        margin-bottom: 1rem;
    }
    .logo {
        margin-right: 0;
    }
    .resources-grid {
        grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
        
    }
    .selected-category h2 {
        font-size: 2rem;
    }
}

@media (max-width: 768px) {
    .main-layout {
        flex-direction: column;
    }
    .sidebar {
        display: none;
        width: 100%;
        position: absolute;
        padding-top: 5rem;
    }
    
    .sidebar.visible {
        display: block;
    }
    
    .content-area {
        margin-left: 0;
    }
    
    .search-container {
        margin-top: 1rem;
        padding-left: 1rem;
    }
    .logo {
        height: 3rem;
        width: auto;
    }
    .selected-category {
        padding: 1rem 1rem;
    }
    .selected-category h2 {
        font-size: 1.5rem;
    }
    .resources-grid {
        grid-template-columns: 1fr;
        padding: 0 1rem;
    }
    .main-container {
        width: 100%;
    }
    .burger-btn {
        display: block;
    }
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: #fff;
    padding: 30px 40px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    text-align: center;
    max-width: 400px;
    z-index: 1001;
}

.modal-content p {
    font-size: 1.5rem;
    color: #1A185C;
    margin-bottom: 20px;
}

.modal-actions {
    display: flex;
    justify-content: center;
    gap: 20px;
}

.save-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.3s;
}

.save-btn {
    background-color: #1150B0;
    color: #fff;
}

.save-btn:hover {
    background-color: #0d3a82;
}

</style>