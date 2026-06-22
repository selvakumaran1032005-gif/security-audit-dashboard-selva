const { query, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');
const { SEVERITY_LEVELS, LOG_STATUSES, MAX_PAGE_SIZE } = require('../config/constants');

const ALLOWED_SORT_FIELDS = [
  'actor',
  'role',
  'action',
  'resource',
  'resourceType',
  'ipAddress',
  'region',
  'severity',
  'status',
  'timestamp',
  'createdAt',
];

const validateGetLogsQuery = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: MAX_PAGE_SIZE })
    .withMessage(`limit must be between 1 and ${MAX_PAGE_SIZE}`),
  query('sortBy')
    .optional()
    .isIn(ALLOWED_SORT_FIELDS)
    .withMessage(`sortBy must be one of: ${ALLOWED_SORT_FIELDS.join(', ')}`),
  query('order').optional().isIn(['asc', 'desc']).withMessage('order must be "asc" or "desc"'),
  query('severity')
    .optional()
    .isIn(SEVERITY_LEVELS)
    .withMessage(`severity must be one of: ${SEVERITY_LEVELS.join(', ')}`),
  query('status')
    .optional()
    .isIn(LOG_STATUSES)
    .withMessage(`status must be one of: ${LOG_STATUSES.join(', ')}`),
  query('startDate').optional().isISO8601().withMessage('startDate must be a valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('endDate must be a valid ISO date'),
];

function runValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(ApiError.badRequest('Invalid query parameters', errors.array().map((e) => e.msg)));
  }
  return next();
}

module.exports = { validateGetLogsQuery, runValidation, ALLOWED_SORT_FIELDS };
