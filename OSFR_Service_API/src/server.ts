import app from '@/app';
import dotenv from 'dotenv';

dotenv.config(); // Загружаем переменные окружения

const PORT = process.env.PORT || 3000; // Получаем порт из переменных окружения

// Запускаем Express-приложение на прослушивание порта
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});