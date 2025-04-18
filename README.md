# 📄 FileCompressor - MERN Stack (TypeScript)

A full-stack file compression tool built with the MERN stack (MongoDB-free!), written entirely in **TypeScript**. This web app allows users to upload PDF files and choose between three compression levels: **Normal**, **Super**, and **Ultra**, depending on the desired balance between file size and quality.

> 🔧 Powered by **Ghostscript (gs)** for file compression and **Multer** for file uploads.  
> 🚫 No database is used — pure file handling.

---

## 🚀 Features

- ⚡️ **Fast & Lightweight**: Upload and compress PDF files in seconds.
- 🎛 **Three Compression Levels**:
  - **Normal Compress**: Retains most of the quality with moderate size reduction.
  - **Super Compress**: Greater compression with slightly reduced quality.
  - **Ultra Compress**: Maximum compression, significantly reduced file size with noticeable quality trade-offs.
- ✅ **Clean and simple UI** built in **React + TypeScript**.
- 📁 Handles file uploads using **Multer**.
- 🧰 Backend compression logic using **Ghostscript CLI**.



## Tech Stack

### Frontend:
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)

### Backend:
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Multer](https://github.com/expressjs/multer)
- [Ghostscript](https://www.ghostscript.com/) - via `gs` CLI

---

## 📦 Compression Levels Explained

| Mode           | Description                                                  | Compression Level | Use Case                          |
|----------------|--------------------------------------------------------------|-------------------|-----------------------------------|
| Normal         | Basic compression using standard quality settings.           | 🟢 Low            | Ideal for general use.            |
| Super          | Higher compression, slightly reducing quality.               | 🟡 Medium         | Great for emails or quick sharing.|
| Ultra          | Aggressive compression, quality may be noticeably reduced.   | 🔴 High           | Best for archiving or very small file size needs.|

Ghostscript parameters differ for each level to achieve the desired output.

---

## 🧪 How to Run Locally

### Prerequisites

- Node.js
- npm
- Ghostscript installed globally (`gs` command should be available)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/file-compressor.git
cd FILE-COMPRESSOR

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

# Backend
node dist/index.js

# Frontend
npm run dev



