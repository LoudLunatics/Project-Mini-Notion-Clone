import express from 'express';
import { syncBlocks } from '../controllers/blockController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Wajib login
router.use(verifyToken);

// Endpoint untuk melakukan sinkronisasi massal dari array blok frontend
router.put('/:noteId/sync', syncBlocks);

export default router;