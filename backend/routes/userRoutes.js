import express from 'express'; 
import { createUser, loginUser } from '../controllers/userController.js'
import e from 'express';


const router = express.Router();

router.post('/signup', createUser);

router.post('/login', loginUser);

export default router;