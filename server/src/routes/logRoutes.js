const express = require('express');
const logController = require('../controllers/logController');
const upload = require('../middlewares/uploadMiddleware');
const { bulkUploadLimiter } = require('../middlewares/rateLimiter');
const { validateGetLogsQuery, runValidation } = require('../middlewares/validateRequest');

const router = express.Router();

router.get('/', validateGetLogsQuery, runValidation, logController.getLogs);
router.get('/stats', logController.getStats);
router.get('/filter-options', logController.getFilterOptions);

router.post(
  '/bulk-upload',
  bulkUploadLimiter,
  upload.single('file'),
  logController.bulkUploadLogs
);

module.exports = router;
