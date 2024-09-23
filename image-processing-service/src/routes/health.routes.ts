import express from 'express';

const router = express.Router();

router.get('/health', (_req, res) => res.status(200));

export default router;
