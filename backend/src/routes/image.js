import express from "express";
import multer from "multer";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs/promises";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const JPEG_QUALITY = 90;
const DEFAULT_BORDER_COLOR = "#000000";
const DEFAULT_BORDER_WIDTH = 3;

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = join(__dirname, "../../uploads");
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
});

router.post(
  "/process-image",
  upload.fields([
    { name: "originalImage", maxCount: 1 },
    { name: "croppedImage", maxCount: 1 },
  ]),
  async (req, res) => {
    let originalPath = null;
    let croppedPath = null;

    try {
      if (!req.files?.originalImage?.[0] || !req.files?.croppedImage?.[0]) {
        return res
          .status(400)
          .json({ error: "Both original and cropped images are required" });
      }

      originalPath = req.files.originalImage[0].path;
      croppedPath = req.files.croppedImage[0].path;

      const { cropX, cropY, cropWidth, cropHeight, borderColor, borderWidth } =
        req.body;

      if (!cropX || !cropY || !cropWidth || !cropHeight) {
        return res.status(400).json({ error: "Crop coordinates are required" });
      }

      const x = parseFloat(cropX);
      const y = parseFloat(cropY);
      const width = parseFloat(cropWidth);
      const height = parseFloat(cropHeight);
      const borderWidthNum = parseInt(borderWidth) || DEFAULT_BORDER_WIDTH;
      const borderColorHex = borderColor || DEFAULT_BORDER_COLOR;

      const originalImage = sharp(originalPath);
      const croppedImage = sharp(croppedPath);
      const metadata = await originalImage.metadata();

      const resizedCropped = await croppedImage
        .resize(Math.round(width), Math.round(height), { fit: "fill" })
        .toBuffer();

      const outputsDir = join(__dirname, "../../outputs");
      await fs.mkdir(outputsDir, { recursive: true });

      const outputFilename = `imageoutput-${Date.now()}.jpeg`;
      const outputPath = join(outputsDir, outputFilename);

      const outputBuffer = await originalImage
        .composite([
          {
            input: resizedCropped,
            top: Math.round(y),
            left: Math.round(x),
          },
        ])
        .toBuffer();

      const svg = `
      <svg width="${metadata.width}" height="${metadata.height}">
        <rect 
          x="${x}" 
          y="${y}" 
          width="${width}" 
          height="${height}" 
          fill="none" 
          stroke="${borderColorHex}" 
          stroke-width="${borderWidthNum}"
        />
      </svg>
    `;

      await sharp(outputBuffer)
        .composite([
          {
            input: Buffer.from(svg),
            top: 0,
            left: 0,
          },
        ])
        .jpeg({ quality: JPEG_QUALITY })
        .toFile(outputPath);

      await fs.unlink(originalPath);
      await fs.unlink(croppedPath);

      const baseUrl =
        process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
      const imageUrl = `${baseUrl}/images/${outputFilename}`;
      res.json({ imageUrl });
    } catch (error) {
      console.error("Error processing image:", error);

      if (originalPath) {
        try {
          await fs.unlink(originalPath);
        } catch (unlinkError) {
          console.error("Error cleaning up original file:", unlinkError);
        }
      }

      if (croppedPath) {
        try {
          await fs.unlink(croppedPath);
        } catch (unlinkError) {
          console.error("Error cleaning up cropped file:", unlinkError);
        }
      }

      res.status(500).json({
        error: "Failed to process image",
        details: error.message,
      });
    }
  }
);

export default router;
