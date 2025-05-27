import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import amenityRoutes from './routes/amenityRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import propertyRoutes from './routes/propertyRoutes.js';

//load environment variables
dotenv.config();
//connect to mongodb
connectDB()
connectCloudinary();

const app = express()
const PORT = process.env.PORT || 4000;

app.use(express.json())
app.use(cookieParser())

//cros setup
const allowedOrigins = ['http://localhost:3000'];
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

//API routes
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/amenities', amenityRoutes);
app.use('/api/properties', propertyRoutes);
//Root route
app.get('/',(req, res) =>{
    res.send('API is running successfully')
})


app.listen(PORT, () => {
    console.log(`Server is running at : http://localhost:${PORT}`);
})