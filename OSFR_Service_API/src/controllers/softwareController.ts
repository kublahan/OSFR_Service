import { Request, Response, NextFunction } from 'express';
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

    const name = req.body.name ? req.body.name.replace(/[^\p{L}\p{N}]/gu, '_') : 'software';
    const uniqueSuffix = Date.now();
    const fileExtension = path.extname(file.originalname);
    cb(null, `${name}_${uniqueSuffix}${fileExtension}`);
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
        const item = result.rows[0];
        let fileName = null;
        if (item.file_path) {
            fileName = path.basename(item.file_path);
        }
        

        res.json({
            ...item,
            file_name: fileName,
        });
    } else {
        res.status(404).json({ error: 'ПО не найдено' });
    }
});

export const updateSoftware = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, category_id } = req.body;
    

    const newFile = req.file;
    let filePath: string | null = null;
    let oldFilePath: string | null = null;


    const oldFileResult = await pool.query('SELECT file_path FROM software WHERE id = $1', [id]);
    if (oldFileResult.rows.length > 0) {
        oldFilePath = oldFileResult.rows[0].file_path;
    }


    if (newFile) {
        filePath = newFile.path;

        if (oldFilePath) {
            fs.unlink(oldFilePath, (err) => {
                if (err) {
                    console.error(`Ошибка при удалении старого файла ${oldFilePath}:`, err);
                }
            });
        }
    } else {

        filePath = oldFilePath;
    }


    const updateQuery = `
        UPDATE software
        SET name = $1, description = $2, file_path = $3, category_id = $4
        WHERE id = $5
        RETURNING *;
    `;
    const updateValues = [name, description, filePath, category_id, id];

    const result = await pool.query(updateQuery, updateValues);
    
    if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
    } else {
        res.status(404).json({ error: 'ПО не найдено для обновления' });
    }
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

export const downloadSoftware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            'SELECT file_path, name FROM software WHERE id = $1', 
            [id]
        );

        if (result.rows.length === 0 || !result.rows[0].file_path) {
            res.status(404).json({ error: 'ПО не найдено' });
            return;
        }

        const filePath = result.rows[0].file_path;
        const displayName = result.rows[0].name;
        
        if (!fs.existsSync(filePath)) {
            res.status(404).json({ error: 'Файл не найден на сервере' });
            return;
        }

        const downloadFileName = `${displayName}.exe`;
        
        return new Promise<void>((resolve, reject) => {
            res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(downloadFileName)}"`);
            res.setHeader('Content-Type', 'application/x-msdownload');
            
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);

            fileStream.on('end', () => {
                resolve();
            });

            fileStream.on('error', (err) => {
                console.error('Ошибка при чтении файла:', err);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Ошибка при чтении файла' });
                }
                reject(err);
            });
        });
    } catch (err) {
        next(err);
    }
});
