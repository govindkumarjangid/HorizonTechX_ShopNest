import multer from 'multer';
import ApiError from '../utils/ApiError.js';

// Memory storage for buffer processing or direct Cloudinary streaming
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Unsupported file format! Please upload an image file (JPEG, PNG, WEBP).'), false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

export default upload;
