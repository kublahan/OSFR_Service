<script>
export default {
  name: 'CategoryDropdown',

  data() {
    return {
        isOpen: false,
    };
  },
};
</script>

<template>
    <div 
    class="category-dropdown-wrapper"
    @click="toggleDropdown">
      <select 
      class="category-dropdown"
      :class="{ 'is-open' : isOpen }"
      @change="isOpen = false">
        <option value="">Все категории</option>
        <option value="main-resources">Основные ресурсы</option>
        <option value="communication-services">Коммуникационные сервисы</option>
        <option value="portal-links">Прямые ссылки портала сотрудника</option>
        <option value="parus">Парус</option>
        <option value="instructions">Инструкции</option>
        <option value="software-list">Перечень ПО</option>
      </select>
      <img
        src="@/assets/icons/Vector.svg"
        alt="Стрелка"
        class="dropdown-arrow-icon"
        :class="{ 'rotated': isOpen }"
      />
    </div>
</template>

<style>
.category-dropdown-wrapper {
  position: relative; /* Контекст для абсолютного позиционирования иконки */
  display: inline-block; /* Или block, в зависимости от желаемого потока */
  width: 29.4631rem; /* Ширина обертки, как у вашего select */
  height: 3.9375rem; /* Высота обертки, как у вашего select */
  margin-left: 1rem;
  margin-top: 36px;
}
.category-dropdown {
    appearance: none;
    background-image: none;
    padding-right: 1rem;
    cursor: pointer;

    width: 100%;
    height: 100%;
    background-color: #D6E9FD;
    border: none;
    border-top-right-radius: 0.625rem;
    border-top-left-radius: 0.625rem;

    font-family: 'Inter-Regular';
    font-size: 1.5625rem;

    padding: 0px 0px 0px 12px;
    box-sizing:border-box;
}

.category-dropdown option {
    
    color: #191F66;
    background-color: #D6E9FD;
}


.dropdown-arrow-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.5rem;
    height: 1.5rem;
    pointer-events: none;
    transition: transform 0.3 ease;
}

.dropdown-arrow-icon.rotated {
    transform: translateY(-50%) rotate(180deg);
}
</style>