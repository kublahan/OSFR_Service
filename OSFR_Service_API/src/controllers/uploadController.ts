import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';


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
  limits: {
    fileSize: 5 * 1024 * 1024
  },
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

        const serverUrl = process.env.SERVER_URL || 'http://localhost:3000';

    const fileUrl = `${serverUrl}/uploads/${path.basename(req.file.path)}`;
    
    res.json({ 
      url: fileUrl,
      filename: req.file.filename,
      originalname: req.file.originalname
    });
  });
};