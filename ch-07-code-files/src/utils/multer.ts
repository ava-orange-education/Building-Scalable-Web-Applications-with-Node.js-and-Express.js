import multer from 'multer';
import { Request } from 'express';
import { IServerConfig } from './config';
import * as config from '../../server_config.json';

// Define the options for Multer
export const multerConfig = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            // Set the destination folder where files will be saved
            const server_config: IServerConfig = config;
            cb(null, server_config.attached_files_path); // Change 'attachedFiles' to your desired folder name
        },
        filename: (req, file, cb) => {
            // Generate a unique filename for the uploaded file
            const uniqueFileName = `${Date.now()}-${file.originalname}`;
            cb(null, uniqueFileName);
        }

    }),
    fileFilter: (req, file, cb) => {
        // Define the allowed file types (MIME types) here.
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];

        // Check if the uploaded file's MIME type is in the allowed list.
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file
        } else {
            cb(new Error('Invalid file type. Only PDF, JPEG, and PNG files are allowed.'), false); // Reject the file

        }
    }
};

const upload = multer(multerConfig);
// Export  the Multer middleware
export const fileUploadMiddleware = upload.single('file');

export const uploadFile = (req: Request) => {

    if (!req.file) {
        throw new Error('No file provided');
    }
    // Here you can perform additional processing and file storage logic
    // For example, save the file to a storage service or local directory
    const fileData = req.file;
    return fileData;
};

