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
  background-color: #D6E9FD; /* Темно-синий */
  color: #1A185C;
  font-weight: 600;
  font-size: 25px;
}

/* Ячейки таблицы */
.table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  color: #000000;
  font-size: 25px;
  font-family: 'Inter-Regular';
  text-align: center;
}

/* Стили кнопки */
.action-btn {
  padding: 6px 12px;
  background-color: transparent;
  border: none;                
  box-shadow: none; 
  color: #1150B0;
  border: none;
  cursor: pointer;
  font-size: 25px;
  font-family: 'Inter-Regular';

}

td.category {
    color: #1A185C;
}

td.name {
    text-align: left;
}

.table tbody tr:nth-child(even) {
    background-color: #EDF6FF;
}

.table tbody tr:nth-child(odd) {
    background-color: #FFFFFF;
}

.table th.col-category,
.table td.category {
  width: 15.4375rem;
  padding-right: 4.75rem;
  text-align: center; /* Например, 250 пикселей для "Категории" */
}

.table th.col-name,
.table td.name {
  width: 45.5625rem;
  text-align: left; /* Например, 500 пикселей для "Наименования" */
}

.table th.col-service {
  width: 150px; /* Например, 150 пикселей для "Сервиса" */
}

.table th.col-action {
  width: 120px; /* Например, 120 пикселей для "Действия" */
}
</style>