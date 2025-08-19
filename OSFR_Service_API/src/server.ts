import app from './app';
import dotenv from 'dotenv';
import { AppDataSource } from './config/data-source';

dotenv.config();

const PORT = process.env.PORT || 3000; 
const HOST = process.env.HOST || 'localhost';


async function startServer() {
  try {

    await AppDataSource.initialize();


    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://${HOST}:${PORT}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start:', error);
    process.exit(1);
  }
}


startServer();