import express from 'express';
import { createPartner, loginPartner } from '../controllers/partnerController.js';

const router = express.Router();

router.post('/signUp', createPartner);

router.post('/login', loginPartner);

export default router;