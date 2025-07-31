import { DataSource } from "typeorm";
import { Admin } from '@/entity/Admin';
import dotenv from 'dotenv'

dotenv.config();


export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    schema: 'public',
    entities: [Admin],
    synchronize: false,               // Только для разработки!
    logging: false
});
