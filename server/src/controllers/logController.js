const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const logService = require('../services/logService');

const bulkUploadLogs = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest('No file was uploaded. Attach a JSON file under field "file"');
  }

  let parsedRecords;
  try {
    parsedRecords = JSON.parse(req.file.buffer.toString('utf-8'));
  } catch (err) {
    throw ApiError.badRequest('Uploaded file is not valid JSON');
  }

  const result = await logService.bulkInsertLogs(parsedRecords);

  res.status(201).json({
    success: true,
    insertedCount: result.insertedCount,
    failedCount: result.failedCount,
    ...(result.failedRecords.length > 0 ? { sampleFailures: result.failedRecords } : {}),
  });
});

const getLogs = asyncHandler(async (req, res) => {
  const { logs, pagination } = await logService.getLogs(req.query);

  res.status(200).json({
    success: true,
    data: logs,
    pagination,
  });
});

const getStats = asyncHandler(async (req, res) => {
  const stats = await logService.getLogStats();
  res.status(200).json({ success: true, data: stats });
});

const getFilterOptions = asyncHandler(async (req, res) => {
  const options = await logService.getDistinctFilterOptions();
  res.status(200).json({ success: true, data: options });
});

module.exports = { bulkUploadLogs, getLogs, getStats, getFilterOptions };
