import multer from 'multer';
import path from 'path';
import { Jimp } from 'jimp';
import ApiResponse from '../utils/apiResponse.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Validate extension
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error('Only JPG, JPEG, PNG, and WEBP image files are supported.'), false);
  }

  // Validate MIME type
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid MIME type. Only JPG, JPEG, PNG, and WEBP are supported.'), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
}).single('image');

export const uploadSingleImage = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      const message =
        err.code === 'LIMIT_FILE_SIZE'
          ? 'File size limit exceeded. Maximum upload size is 5MB.'
          : err.message;
      return ApiResponse.error(res, message, 400, 'FILE_UPLOAD_ERROR');
    }

    // Reject empty uploads
    if (!req.file || !req.file.buffer || req.file.buffer.length === 0) {
      return ApiResponse.error(res, 'No file uploaded or file is empty.', 400, 'EMPTY_FILE_UPLOAD');
    }

    // Reject corrupted/invalid images using Jimp
    try {
      const image = await Jimp.read(req.file.buffer);
      // Check minimum resolution
      if (image.width < 30 || image.height < 30) {
        return ApiResponse.error(
          res,
          'Invalid image: resolution is too low.',
          400,
          'INVALID_IMAGE_RESOLUTION'
        );
      }
    } catch (jimpErr) {
      return ApiResponse.error(
        res,
        'Invalid or corrupted image file.',
        400,
        'CORRUPTED_IMAGE_FILE'
      );
    }

    next();
  });
};
