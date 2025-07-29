// src/server.ts
import app from '@/app'; // Импортируем сконфигурированное Express-приложение
import dotenv from 'dotenv'; // Для доступа к переменным окружения, если они нужны здесь

dotenv.config(); // Загружаем переменные окружения

const PORT = process.env.PORT || 3000; // Получаем порт из переменных окружения

// Запускаем Express-приложение на прослушивание порта
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});