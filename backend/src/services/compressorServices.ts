import { Request, Response } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { tmpdir } from 'os';

const execAsync = promisify(exec)

export const pdfCompressor = async (file: Express.Multer.File): Promise<Buffer> => {
  const inputPath = file.path;
  const outputPath = path.join(tmpdir(), `compressed-${Date.now()}.pdf`);

  // Check if input file exists
  try {
    await fs.access(inputPath);
  } catch (error) {
    throw new Error('Input file does not exist');
  }

  const gsCommand = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`;

  try {
    // Add a 30-second timeout for Ghostscript
    await execAsync(gsCommand, { timeout: 30000 });

    // Check if output file exists
    try {
      await fs.access(outputPath);
    } catch (error) {
      throw new Error('PDF compression failed (no output file)');
    }

    const compressedBuffer = await fs.readFile(outputPath);

    await fs.unlink(outputPath).catch(() => {}); 

    return compressedBuffer;
  } catch (error) {
    console.error('PDF compression failed:', error);
    throw new Error('Failed to compress PDF');
  }
};

export const docsCompressor = async (file: Express.Multer.File): Promise<Buffer> => {
  const inputPath = file.path;
  const outputDir = tmpdir();
  const outputPath = path.join(outputDir, path.basename(inputPath, path.extname(inputPath)) + '.docx')

  // Check if input file exists
  try {
    await fs.access(inputPath);
  } catch (error) {
    throw new Error('Input file does not exist');
  }

  const command = `soffice --headless --convert-to docx --outdir "${outputDir}" "${inputPath}"`;

  try {
    await execAsync(command, { timeout: 30000 });
    try {
      await fs.access(outputPath);
    } catch (error) {
      throw new Error('DOCX conversion failed (no output file)');
    }

    const buffer = await fs.readFile(outputPath);
    await fs.unlink(outputPath).catch(() => {}); 

    return buffer;
  } catch (error) {
    console.error('DOCX conversion failed:', error);
    throw new Error('Failed to convert document');
  }
};