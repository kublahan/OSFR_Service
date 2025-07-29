<template>
    <div class="table-responsive table-container">
        <table class="table">
            <thead>
                <tr>
                    <th class="col-category">Категория</th>
                    <th class="col-name">Наименование</th>
                    <th class="col-service">Сервис</th>
                    <th class="col-action">Действие</th>
                </tr>
            </thead>
            <!-- <tbody>
                <tr v-for="resource in resources" :key="resource.id">
                    <td>{{ resource.category }}</td>
                    <td>{{ resource.name }}</td>
                    <td>{{ resource.service }}</td>
                    <td>
                        <button
                        @click="openResource(resource.url)"
                        class="btn btn-primary btn-sm">
                            Открыть
                        </button>
                    </td>
                </tr>
            </tbody> -->
        <tbody>
        <tr>
          <td class="category">Основные ресурсы</td>
          <td class="name">Корпоративный портал социального фонда России</td>
          <td>(Портал СФР)</td>
          <td><button class="action-btn">Открыть</button></td>
        </tr>
        <tr>
          <td class="category">Основные ресурсы</td>
          <td class="name">Система электронного документооборота</td>
          <td>(СЭД)</td>
          <td><button class="action-btn">Открыть</button></td>
        </tr>
        <tr>
          <td class="category">Коммуникационные сервисы</td>
          <td class="name">Информационная аналитическая система</td>
          <td>(ИАС)</td>
          <td><button class="action-btn">Открыть</button></td>
        </tr>
        <tr>
          <td class="category">Ссылки ПС</td>
          <td class="name">Система межведомственного взаимодействия</td>
          <td>(СМЭВ)</td>
          <td><button class="action-btn">Открыть</button></td>
        </tr>
        <tr>
          <td class="category">Парус</td>
          <td class="name">Портал фонда пенсионного и социального страхования РФ</td>
          <td>(Портал ФСС)</td>
          <td><button class="action-btn">Открыть</button></td>
        </tr>
      </tbody>
        </table>
    </div>
</template>

<script lang="ts">

export default {
  name: 'ResourcesTable'
};
</script>

<style scoped>
/* Основной контейнер таблицы */
.table-container {
  margin: 20px auto;
  border-radius: 8px;
  overflow: hidden;
  width: 118.75rem;
}

/* Стили таблицы */
.table {
  width: 100%;
  border-collapse: collapse;
}

/* Заголовки столбцов */
.table th {
  background-color: #D6E9FD;
  color: #1A185C;
  font-weight: 600;
  font-size: 25px;
  text-align: center; /* Все заголовки по центру */
  padding: 12px 16px;
}

/* Общие стили ячеек */
.table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  color: #000000;
  font-size: 25px;
  font-family: 'Inter-Regular';
  text-align: center; /* По умолчанию все ячейки по центру */
}

/* Специальное выравнивание для Наименования */
.table td.name {
  text-align: left; /* Только содержимое Наименования слева */
}

/* Стили кнопки */
.action-btn {
  padding: 6px 12px;
  background-color: transparent;
  border: none;
  box-shadow: none;
  color: #1150B0;
  cursor: pointer;
  font-size: 25px;
  font-family: 'Inter-Regular';
}

/* Цвета для категорий */
td.category {
  color: #1A185C;
}

/* Чередование цветов строк */
.table tbody tr:nth-child(even) {
  background-color: #EDF6FF;
}

.table tbody tr:nth-child(odd) {
  background-color: #FFFFFF;
}

/* Ширины колонок */
.table th.col-category,
.table td.category {
  width: 15.4375rem;
  padding-right: 4.75rem;
}

.table th.col-name,
.table td.name {
  width: 45.5625rem;
  /* Заголовок по центру, содержимое слева */
}

.table th.col-service {
  width: 150px;
}

.table th.col-action {
  width: 120px;
}

/* Гарантируем, что заголовок Наименования будет по центру */
.table th.col-name {
  text-align: center;
}
</style>