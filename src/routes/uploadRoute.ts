import { Router } from "express";
import multer from "multer";
import { uploadController } from "../controllers/uploadController";
import { validateToken } from "../middleware/validateToken";

const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

router.post("/", validateToken, upload.single("file"), uploadController.upload);

export default router;

