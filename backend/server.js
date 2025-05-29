import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import amenityRoutes from './routes/amenityRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import propertyRoutes from './routes/propertyRoutes.js';
import partnerRoutes from './routes/partnerRoutes.js';
//load environment variables
dotenv.config();
//connect to mongodb
connectDB()
connectCloudinary();

const app = express()
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

//socket.io setup
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
//store the io in app so we use it in controllers
app.set('io', io);

//Middlwares
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
app.use('/api/partners', partnerRoutes);

//Root route
app.get('/',(req, res) =>{
    res.send('API is running successfully')
})

//Socket.io connection listener
io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
    });

    // You can add more event listeners here for different socket events
})

app.listen(PORT, () => {
    console.log(`Server is running at : http://localhost:${PORT}`);
})