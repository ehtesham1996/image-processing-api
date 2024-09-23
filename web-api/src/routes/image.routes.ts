import multer from 'multer';
import express from 'express';
import { uploadImage, addComment } from '@controllers/image-controller';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/images/:id/comments', addComment);
router.post('/images', upload.single('file'), uploadImage);

export default router;
