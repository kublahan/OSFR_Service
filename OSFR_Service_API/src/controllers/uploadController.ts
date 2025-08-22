import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// const uploadDir = 'D:\\Programming\\Projects\\ImageOSFR';
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'image-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Разрешены только изображения'));
    }
  }
});


export const uploadImage = (req: Request, res: Response) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Ошибка загрузки:', err);
      return res.status(400).json({ 
        error: err instanceof multer.MulterError 
          ? err.message 
          : 'Неверный тип файла'
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Файл не был загружен' });
    }

    // const serverUrl = 'http://localhost:3000';
    const serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
    const fileUrl = `${serverUrl}/uploads/${path.basename(req.file.path)}`;
    
    res.json({ 
      url: fileUrl,
      filename: req.file.filename,
      originalname: req.file.originalname
    });
  });
};


export const deleteImage = (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL изображения не предоставлен' });
  }

  const filename = path.basename(url);
  const filePath = path.join(uploadDir, filename);


  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Файл не найден' });
  }


  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Ошибка при удалении файла ${filePath}:`, err);
      return res.status(500).json({ error: 'Ошибка при удалении файла' });
    }
    res.status(200).json({ message: 'Файл успешно удалён' });
  });
};