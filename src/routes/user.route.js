import express from 'express';
import { savePost, getSavedPosts } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/saved', getSavedPosts);
router.patch('/save', savePost);

export default router;