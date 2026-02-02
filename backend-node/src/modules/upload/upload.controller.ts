import { Request, Response } from 'express';

export const UploadController = {
    async uploadFile(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
            
            // Return the file path relative to the server
            // We will serve the 'uploads' directory at /uploads
            const filePath = `/uploads/${req.file.filename}`;
            
            return res.status(201).json({ 
                message: 'File uploaded successfully',
                filePath,
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size
            });
        } catch (error: any) {
            console.error('Upload Error:', error);
            return res.status(500).json({ message: 'File upload failed' });
        }
    }
};
