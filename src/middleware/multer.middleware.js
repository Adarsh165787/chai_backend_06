import multer from "multer";
import fs from "fs";
import path from "path";

const tempDir = path.join(process.cwd(), "public", "temp");
fs.mkdirSync(tempDir, { recursive: true });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        const safeName = file.originalname.replace(/\s+/g, "_");
        const uniqueName = `${Date.now()}-${safeName}`;
        cb(null, uniqueName);
    }
});

export const upload = multer({ storage });