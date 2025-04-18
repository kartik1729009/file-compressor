"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userfile = void 0;
const compressorServices_1 = require("../services/compressorServices");
const processCompression = (file, level, compressor) => __awaiter(void 0, void 0, void 0, function* () {
    const repetitions = level === "superCompress" ? 2 : level === "ultraCompress" ? 3 : 1;
    let result = file.buffer;
    for (let i = 0; i < repetitions; i++) {
        const fileCopy = Object.assign(Object.assign({}, file), { buffer: result });
        result = yield compressor(fileCopy);
    }
    return result;
});
const userfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        let compressedFile;
        if (fileType === "Docs") {
            compressedFile = yield processCompression(file, level, compressorServices_1.docsCompressor);
        }
        else if (fileType === "Pdf") {
            compressedFile = yield processCompression(file, level, compressorServices_1.pdfCompressor);
        }
        else {
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
    }
    catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.userfile = userfile;
