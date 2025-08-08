import { Request, Response } from 'express';
import pool from '../models';
import asyncHandler from 'express-async-handler';
import path from 'path';
import multer from 'multer';
import fs from 'fs';

const uploadDir = process.env.SOFTWARE_DIR || path.join(__dirname, '..', '..', 'uploads', 'software');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) {
        console.log(`Директория для загрузки файлов не найдена. Создаю: ${uploadDir}`);
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({ storage: storage });

export const createSoftware = asyncHandler(async (req: Request, res: Response) => {
    console.log('Данные req.body:', req.body);
    console.log('Данные req.file:', req.file);

    const { name, description, category_id } = req.body;
    
    if (!req.file) {
        res.status(400).json({ error: 'Не удалось загрузить файл. Пожалуйста, убедитесь, что файл был выбран.' });
        return;
    }
    const filePath = req.file.path;

    if (!name || !category_id) {
        res.status(400).json({ error: 'Необходимо указать имя и категорию' });
        return;
    }

    const newSoftware = await pool.query(
        'INSERT INTO software (name, description, file_path, category_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, description, filePath, category_id]
    );

    res.status(201).json(newSoftware.rows[0]);
});

export const getSoftwarebyId = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await pool.query('SELECT id, category_id, name, description, file_path FROM software WHERE id = $1', [id]);
    if (result.rows.length > 0) {
        res.json(result.rows[0]);
    } else {
        res.status(404).json({ error: 'ПО не найдено' });
    }
});

export const updateSoftware = asyncHandler(async (req: Request, res: Response) => {
    res.status(501).json({ message: 'Функция обновления ПО еще не реализована' });
});


export const deleteSoftware = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;


    const findResult = await pool.query('SELECT file_path FROM software WHERE id = $1', [id]);
    if (findResult.rows.length === 0) {
        res.status(404).json({ error: 'ПО не найдено' });
        return;
    }
    const filePath = findResult.rows[0].file_path;


    const deleteResult = await pool.query('DELETE FROM software WHERE id = $1 RETURNING *', [id]);
    if (deleteResult.rows.length === 0) {
        res.status(404).json({ error: 'ПО не найдено для удаления' });
        return;
    }


    if (filePath) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(`Ошибка при удалении файла ${filePath}:`, err);
            }
        });
    }

    res.status(200).json({ message: 'ПО успешно удалено' });
});

export const downloadSoftware = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await pool.query('SELECT file_path FROM software WHERE id = $1', [id]);

    if (result.rows.length > 0 && result.rows[0].file_path) {
        const filePath = result.rows[0].file_path;
        res.download(filePath, (err) => {
            if (err) {
                console.error('Ошибка при скачивании файла:', err);
                res.status(500).json({ error: 'Не удалось скачать файл' });
            }
        });
    } else {
        res.status(404).json({ error: 'Файл не найден' });
    }
});
