import express from 'express';
import { getMyNotes, getNoteById, createNote, updateNote, deleteNote } from '../controllers/noteController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verifyToken); // Middleware pengecekan login

// Endpoint: POST /api/notes/
router.post('/', createNote); 
router.get('/', getMyNotes);
router.get('/:id', getNoteById);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;