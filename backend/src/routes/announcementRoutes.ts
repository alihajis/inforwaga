import express from 'express';
import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcementController';
import { auth, adminOnly } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getAnnouncements);
router.get('/:id', getAnnouncementById);

// Admin only routes
router.post('/', auth, adminOnly, createAnnouncement);
router.put('/:id', auth, adminOnly, updateAnnouncement);
router.delete('/:id', auth, adminOnly, deleteAnnouncement);

export default router;
