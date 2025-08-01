import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['DB_USER', 'DB_HOST', 'DB_DATABASE', 'DB_PASSWORD'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

const poolConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    // max: 20,
    // idleTimeoutMillis: 30000,
    // connectionTimeoutMillis: 2000, Для оптимизации можно включить, но тогда появятся ограничения пользования
};

const pool = new Pool(poolConfig);

pool.query('SELECT NOW()')
    .then(() => console.log('✅ Database connection established'))
    .catch(err => {
        console.error('❌ Database connection failed:', err);
        process.exit(1);
    });

pool.on('error', (err) => {
    console.error('Unexpected database error:', err);
});

export default pool;