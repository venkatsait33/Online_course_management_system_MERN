import express from 'express';
import { createUser, loginUser, logout } from '../controller/user.controller.js';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/logout', logout)

export default router;