import express from 'express';
import { createAmenity, getAllAmenities } from '../controllers/amenityController.js';
import { verifyAdmin } from '../middlewares/authAdmin.js';

const router = express.Router();

// POST /api/amenities
router.post('/',  createAmenity);

// GET /api/amenities
router.get('/', getAllAmenities);

export default router;