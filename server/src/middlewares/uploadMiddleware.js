const multer = require('multer');
const ApiError = require('../utils/ApiError');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const isJson =
    file.mimetype === 'application/json' || file.originalname.toLowerCase().endsWith('.json');

  if (!isJson) {
    cb(ApiError.badRequest('Only JSON files are accepted for bulk upload'));
    return;
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB ceiling, well above 10k log records
  },
});

module.exports = upload;
