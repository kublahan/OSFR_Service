<template>
  <div class="category-dropdown-wrapper">
    <!-- Заголовок выпадающего списка, который будет открывать/закрывать список -->
    <div class="category-dropdown-header" @click="toggleDropdown">
      <!-- Отображаем выбранную категорию или "Все категории" -->
      <span>{{ displaySelectedCategory }}</span>
      <!-- Иконка стрелки, которая будет вращаться -->
      <svg
        :class="{ 'rotated': isOpen }"
        class="dropdown-arrow-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </div>

    <!-- Сам выпадающий список (отображается, если isOpen = true) -->
    <div v-if="isOpen" class="category-dropdown-list">
      <!-- Опция "Все категории" -->
      <div
        class="category-dropdown-item"
        @click="selectCategory(null)"
      >
        Все категории
      </div>
      <!-- Динамический список категорий -->
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-dropdown-item"
        @click="selectCategory(category.id, category.name)"
      >
        {{ category.name }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CategoryDropdown',
  data() {
    return {
      categories: [], // Массив объектов категорий { id: number, name: string }
      selectedCategoryId: null, // ID выбранной категории (null для "Все категории")
      selectedCategoryName: 'Все категории', // Отображаемое имя выбранной категории
      isOpen: false, // Состояние для управления открытием/закрытием выпадающего списка
    };
  },
  computed: {
    // Вычисляемое свойство для отображения выбранной категории в заголовке
    displaySelectedCategory() {
      return this.selectedCategoryName;
    }
  },
  async created() {
    try {
      // Запрос к бэкенду для получения категорий
      const response = await axios.get('http://localhost:3000/api/categories');
      // Ожидаем, что response.data будет массивом объектов { id: number, name: string }
      this.categories = response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  },
  methods: {
    /**
     * Переключает состояние открытия/закрытия выпадающего списка.
     */
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    /**
     * Выбирает категорию и закрывает выпадающий список.
     * @param {number|null} id - ID выбранной категории.
     * @param {string} name - Имя выбранной категории.
     */
    selectCategory(id, name = 'Все категории') {
      this.selectedCategoryId = id;
      this.selectedCategoryName = name;
      this.isOpen = false; // Закрываем список после выбора
      this.emitFilter(); // Вызываем метод для отправки события фильтрации
    },
    /**
     * Отправляет событие 'update:category' родительскому компоненту с выбранным ID категории.
     */
    emitFilter() {
      // Используем 'update:category' для соответствия MainView.vue
      this.$emit('update:category', this.selectedCategoryId);
    },
  },
};
</script>

<style scoped>
/* Ваши стили, которые теперь будут применяться к новой структуре HTML */

.category-dropdown-wrapper {
  position: relative;
  width: 29.4631rem;
  margin-left: 1rem;
  margin-top: 2.25rem;
  font-family: 'Inter-Regular';
  z-index: 1000; /* Убедитесь, что выпадающий список находится поверх других элементов */
}

.category-dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 3.9375rem;
  background-color: #D6E9FD;
  border: none;
  border-radius: 0.625rem; /* Единый радиус для закрытого состояния */
  font-size: 1.5625rem;
  color: #191F66;
  padding: 0 1rem;
  cursor: pointer;
  /* Добавим небольшой box-shadow для эффекта */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Стили для заголовка, когда список открыт (верхние углы остаются закругленными, нижние - прямые) */
.category-dropdown-wrapper.open .category-dropdown-header {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}


.category-dropdown-list {
  position: absolute;
  top: 100%; /* Размещаем список сразу под заголовком */
  left: 0;
  width: 100%;
  background-color: #D6E9FD;
  border-radius: 0 0 0.625rem 0.625rem; /* Закругленные нижние углы */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* Скрываем содержимое, выходящее за границы */
  border-top: 1px solid #c0d9fa; /* Небольшая граница между заголовком и списком */
}

.category-dropdown-item {
  padding: 0.75rem 1rem;
  font-size: 1.25rem;
  color: #191F66;
  cursor: pointer;
  border-bottom: 1px solid rgba(25, 31, 102, 0.1); /* Разделитель между пунктами */
}

.category-dropdown-item:last-child {
  border-bottom: none; /* Убираем разделитель у последнего элемента */
}

.category-dropdown-item:hover {
  background-color: #c0d9fa;
}

.category-dropdown-item.disabled {
  color: #999;
  cursor: default;
  pointer-events: none;
}

.dropdown-arrow-icon {
  width: 1.5rem;
  height: 1.5rem;
  transition: transform 0.3s ease;
}

.dropdown-arrow-icon.rotated {
  transform: rotate(180deg);
}
</style>
