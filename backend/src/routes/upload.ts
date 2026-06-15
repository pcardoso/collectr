import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { putObject } from '../config/s3';

const router = Router();

// Memory storage – we pipe the buffer straight to S3
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (_req, file, cb) => {
    const ALLOWED_MIME = [
      'application/pdf',
      'message/rfc822',
      'application/vnd.ms-outlook',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp',
      'application/octet-stream',
    ];
    const ALLOWED_EXT = ['.pdf', '.eml', '.msg', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_MIME.includes(file.mimetype) || ALLOWED_EXT.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
});

router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file provided' });
    return;
  }

  const ext = path.extname(req.file.originalname).toLowerCase() || '.bin';
  const key = `receipts/${uuidv4()}${ext}`;

  try {
    const url = await putObject(key, req.file.buffer, req.file.mimetype);
    res.json({ url, key });
  } catch (err) {
    console.error('[upload] S3 error:', err);
    res.status(500).json({ error: 'Failed to upload file to S3' });
  }
});

export default router;
