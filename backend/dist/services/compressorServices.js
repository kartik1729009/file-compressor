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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.docsCompressor = exports.pdfCompressor = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const os_1 = require("os");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
const pdfCompressor = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const inputPath = file.path;
    const outputPath = path_1.default.join((0, os_1.tmpdir)(), `compressed-${Date.now()}.pdf`);
    // Check if input file exists
    try {
        yield promises_1.default.access(inputPath);
    }
    catch (error) {
        throw new Error('Input file does not exist');
    }
    const gsCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`;
    try {
        // Add a 30-second timeout for Ghostscript
        yield execAsync(gsCommand, { timeout: 30000 });
        // Check if output file exists
        try {
            yield promises_1.default.access(outputPath);
        }
        catch (error) {
            throw new Error('PDF compression failed (no output file)');
        }
        const compressedBuffer = yield promises_1.default.readFile(outputPath);
        yield promises_1.default.unlink(outputPath).catch(() => { });
        return compressedBuffer;
    }
    catch (error) {
        console.error('PDF compression failed:', error);
        throw new Error('Failed to compress PDF');
    }
});
exports.pdfCompressor = pdfCompressor;
const docsCompressor = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const inputPath = file.path;
    const outputDir = (0, os_1.tmpdir)();
    const outputPath = path_1.default.join(outputDir, path_1.default.basename(inputPath, path_1.default.extname(inputPath)) + '.docx');
    // Check if input file exists
    try {
        yield promises_1.default.access(inputPath);
    }
    catch (error) {
        throw new Error('Input file does not exist');
    }
    const command = `soffice --headless --convert-to docx --outdir "${outputDir}" "${inputPath}"`;
    try {
        yield execAsync(command, { timeout: 30000 });
        try {
            yield promises_1.default.access(outputPath);
        }
        catch (error) {
            throw new Error('DOCX conversion failed (no output file)');
        }
        const buffer = yield promises_1.default.readFile(outputPath);
        yield promises_1.default.unlink(outputPath).catch(() => { });
        return buffer;
    }
    catch (error) {
        console.error('DOCX conversion failed:', error);
        throw new Error('Failed to convert document');
    }
});
exports.docsCompressor = docsCompressor;
