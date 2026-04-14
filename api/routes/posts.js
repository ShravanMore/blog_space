import express from 'express';
import { getPosts, getPost, createPost, deletePost, updatePost, incrementView, toggleLike } from '../controllers/post.js';
const router = express.Router();

router.get('/', getPosts)
router.get('/:id', getPost)
router.post('/', createPost)
router.delete('/:id', deletePost)
router.put('/:id', updatePost)
router.put('/:id/view', incrementView)
router.post('/:id/like', toggleLike)

export default router;