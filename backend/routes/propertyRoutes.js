import express from 'express';
import upload from '../middlewares/multer.js';
import { createProperty } from '../controllers/propertyController.js';
import { verifyAdmin } from '../middlewares/authAdmin.js';

const router = express.Router();

router.post('/',  upload.array('photos', 5 ), createProperty);

export default router;