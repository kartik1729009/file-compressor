"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes/routes"));
const multer_1 = __importDefault(require("multer"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(), // Store files in memory
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});
app.use('/api', routes_1.default);
app.get('/', (req, res) => {
    res.send('File Compression Service is running');
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
