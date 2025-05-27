import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import {v2 as cloudinary} from 'cloudinary';

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'your-folder-name', // Replace with your desired folder name
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 800, height: 600, crop: 'limit' }],
    },
});

const upload = multer({ storage });

export default upload;