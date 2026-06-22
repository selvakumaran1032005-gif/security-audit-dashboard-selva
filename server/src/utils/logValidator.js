const { SEVERITY_LEVELS, LOG_STATUSES } = require('../config/constants');

const REQUIRED_FIELDS = [
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
];

const IP_REGEX = /^([0-9a-fA-F:.]+)$/;

/**
 * Validates a single raw log record from an uploaded JSON file.
 * Returns { valid: boolean, errors: string[] }
 */
function validateLogRecord(record, index) {
  const errors = [];

  if (typeof record !== 'object' || record === null || Array.isArray(record)) {
    return { valid: false, errors: [`Record at index ${index} is not a valid object`] };
  }

  REQUIRED_FIELDS.forEach((field) => {
    if (record[field] === undefined || record[field] === null || record[field] === '') {
      errors.push(`Missing required field "${field}"`);
    }
  });

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  if (record.ipAddress && !IP_REGEX.test(String(record.ipAddress))) {
    errors.push('Invalid ipAddress format');
  }

  if (record.severity && !SEVERITY_LEVELS.includes(String(record.severity).toUpperCase())) {
    errors.push(`Invalid severity. Must be one of: ${SEVERITY_LEVELS.join(', ')}`);
  }

  if (record.status && !LOG_STATUSES.includes(String(record.status))) {
    errors.push(`Invalid status. Must be one of: ${LOG_STATUSES.join(', ')}`);
  }

  const parsedDate = new Date(record.timestamp);
  if (Number.isNaN(parsedDate.getTime())) {
    errors.push('Invalid timestamp');
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateLogRecord, REQUIRED_FIELDS };
