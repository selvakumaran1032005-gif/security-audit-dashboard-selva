module.exports = {
  SEVERITY_LEVELS: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
  LOG_STATUSES: ['Resolved', 'Unresolved', 'Investigating', 'Ignored'],
  MAX_BULK_RECORDS: parseInt(process.env.MAX_BULK_RECORDS, 10) || 20000,
  BULK_INSERT_BATCH_SIZE: parseInt(process.env.BULK_INSERT_BATCH_SIZE, 10) || 1000,
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 200,
};
