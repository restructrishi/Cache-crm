import { Request, Response } from 'express';
import fs from 'fs';

// Mock Virus Scanner Service
const scanFile = async (filePath: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        // Simulate scanning delay
        setTimeout(() => {
            // Check for EICAR test string in filename or simple logic
            // In a real scenario, this would call ClamAV or similar
            if (filePath.includes('eicar')) {
                resolve(false); // Virus detected
            } else {
                resolve(true); // Clean
            }
        }, 500);
    });
};

export const UploadController = {
    async uploadFile(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
            
            const filePath = `/uploads/${req.file.filename}`;
            const absolutePath = req.file.path;

            // Perform Virus Scan
            const isClean = await scanFile(absolutePath);

            if (!isClean) {
                // Delete the infected file immediately
                fs.unlinkSync(absolutePath);
                return res.status(400).json({ 
                    message: 'Security Alert: Virus detected in uploaded file. File rejected.' 
                });
            }
            
            return res.status(201).json({ 
                message: 'File uploaded successfully',
                filePath,
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size,
                securityScan: 'Passed'
            });
        } catch (error: any) {
            console.error('Upload Error:', error);
            // Clean up file if processing failed
            if (req.file && req.file.path && fs.existsSync(req.file.path)) {
                 try { fs.unlinkSync(req.file.path); } catch (e) {}
            }
            return res.status(500).json({ message: 'File upload failed' });
        }
    }
};
