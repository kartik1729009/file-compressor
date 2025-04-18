import { Request, Response } from 'express';
import { pdfCompressor, docsCompressor } from '../services/compressorServices';

type CompressionLevel = "compress" | "superCompress" | "ultraCompress";

const processCompression = async (
    file: Express.Multer.File,
    level: CompressionLevel,
    compressor: (file: Express.Multer.File) => Promise<Buffer>
): Promise<Buffer> => {
    const repetitions = level === "superCompress" ? 2 : level === "ultraCompress" ? 3 : 1;
    
    let result = file.buffer;
    for (let i = 0; i < repetitions; i++) {
        const fileCopy = { ...file, buffer: result };
        result = await compressor(fileCopy);
    }
    
    return result;
};
export const userfile = async (req: Request, res: Response) => {
    try {
        const { fileType, level } = req.body;
        const file = req.file;

        if (!file) {
            res.status(400).json({ success: false, message: "File not provided" });
            return;
        }

        if (!["compress", "superCompress", "ultraCompress"].includes(level)) {
            res.status(400).json({ success: false, message: "Invalid compression level" });
            return;
        }

        let compressedFile: Buffer;

        if (fileType === "Docs") {
            compressedFile = await processCompression(file, level as CompressionLevel, docsCompressor);
        } else if (fileType === "Pdf") {
            compressedFile = await processCompression(file, level as CompressionLevel, pdfCompressor);
        } else {
            res.status(400).json({ success: false, message: "Invalid file type" });
            return;
        }

        if (!compressedFile || compressedFile.length === 0) {
            console.error("Compression failed: Empty file buffer");
            res.status(500).json({ success: false, message: "Compression failed, no file generated" });
            return;
        }

        console.log('Compressed file buffer size:', compressedFile.length);

        res.set({
            'Content-Type': 'application/pdf', // Set correct content type for PDF
            'Content-Disposition': `attachment; filename=compressed_${file.originalname}`
        });

        res.send(compressedFile); 

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
