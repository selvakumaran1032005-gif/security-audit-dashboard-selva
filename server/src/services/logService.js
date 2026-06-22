const Log = require('../models/Log');
const ApiError = require('../utils/ApiError');
const { validateLogRecord } = require('../utils/logValidator');
const {
  MAX_BULK_RECORDS,
  BULK_INSERT_BATCH_SIZE,
  DEFAULT_PAGE_SIZE,
} = require('../config/constants');

/**
 * Parses, validates, and inserts a batch of raw log records.
 * Invalid records are skipped (not rejected as a whole batch) so partial
 * uploads still succeed, mirroring real-world ingestion pipelines.
 */
async function bulkInsertLogs(rawRecords) {
  if (!Array.isArray(rawRecords)) {
    throw ApiError.badRequest('Uploaded file must contain a JSON array of log records');
  }

  if (rawRecords.length === 0) {
    throw ApiError.badRequest('Uploaded file contains no records');
  }

  if (rawRecords.length > MAX_BULK_RECORDS) {
    throw ApiError.badRequest(
      `Upload exceeds the maximum of ${MAX_BULK_RECORDS} records per request`
    );
  }

  const validRecords = [];
  const failedRecords = [];

  rawRecords.forEach((record, index) => {
    const { valid, errors } = validateLogRecord(record, index);
    if (valid) {
      validRecords.push({
        actor: record.actor,
        role: record.role,
        action: String(record.action).toUpperCase(),
        resource: record.resource,
        resourceType: record.resourceType,
        ipAddress: record.ipAddress,
        region: record.region,
        severity: String(record.severity).toUpperCase(),
        status: record.status,
        timestamp: new Date(record.timestamp),
      });
    } else {
      failedRecords.push({ index, errors });
    }
  });

  let insertedCount = 0;
  const insertErrors = [];

  for (let i = 0; i < validRecords.length; i += BULK_INSERT_BATCH_SIZE) {
    const batch = validRecords.slice(i, i + BULK_INSERT_BATCH_SIZE);
    try {
      const result = await Log.insertMany(batch, { ordered: false, lean: true });
      insertedCount += result.length;
    } catch (err) {
      // insertMany with ordered:false still inserts the valid docs in the
      // batch and reports failures via writeErrors
      if (err.insertedDocs) {
        insertedCount += err.insertedDocs.length;
      }
      if (err.writeErrors) {
        insertErrors.push(
          ...err.writeErrors.map((we) => ({
            index: i + we.index,
            errors: [we.errmsg],
          }))
        );
      } else {
        insertErrors.push({ index: i, errors: [err.message] });
      }
    }
  }

  return {
    insertedCount,
    failedCount: rawRecords.length - insertedCount,
    failedRecords: [...failedRecords, ...insertErrors].slice(0, 100), // cap detail payload size
  };
}

/**
 * Builds a Mongo filter object from sanitized query params.
 */
function buildFilter(params) {
  const filter = {};

  if (params.severity) filter.severity = params.severity;
  if (params.status) filter.status = params.status;
  if (params.role) filter.role = params.role;
  if (params.action) filter.action = String(params.action).toUpperCase();
  if (params.region) filter.region = params.region;

  if (params.startDate || params.endDate) {
    filter.timestamp = {};
    if (params.startDate) filter.timestamp.$gte = new Date(params.startDate);
    if (params.endDate) filter.timestamp.$lte = new Date(params.endDate);
  }

  if (params.search) {
    const safe = params.search.trim();
    if (safe) {
      // Regex search across key fields so partial / substring matches work
      // in addition to the text index (text index requires whole-word matches)
      const regex = new RegExp(safe.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ actor: regex }, { action: regex }, { resource: regex }, { ipAddress: regex }];
    }
  }

  return filter;
}

async function getLogs(params) {
  const page = parseInt(params.page, 10) || 1;
  const limit = parseInt(params.limit, 10) || DEFAULT_PAGE_SIZE;
  const skip = (page - 1) * limit;

  const sortBy = params.sortBy || 'timestamp';
  const order = params.order === 'asc' ? 1 : -1;

  const filter = buildFilter(params);

  const [logs, totalCount] = await Promise.all([
    Log.find(filter).sort({ [sortBy]: order }).skip(skip).limit(limit).lean(),
    Log.countDocuments(filter),
  ]);

  return {
    logs,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit) || 1,
      hasNextPage: skip + logs.length < totalCount,
      hasPrevPage: page > 1,
    },
  };
}

/**
 * Aggregates dashboard-level statistics in a single round trip using
 * $facet so the four stat cards never require four separate queries.
 */
async function getLogStats() {
  const [result] = await Log.aggregate([
    {
      $facet: {
        total: [{ $count: 'count' }],
        highSeverity: [{ $match: { severity: { $in: ['HIGH', 'CRITICAL'] } } }, { $count: 'count' }],
        resolved: [{ $match: { status: 'Resolved' } }, { $count: 'count' }],
        unresolved: [{ $match: { status: 'Unresolved' } }, { $count: 'count' }],
      },
    },
  ]);

  const extract = (arr) => (arr && arr.length > 0 ? arr[0].count : 0);

  return {
    totalLogs: extract(result.total),
    highSeverityLogs: extract(result.highSeverity),
    resolvedLogs: extract(result.resolved),
    unresolvedLogs: extract(result.unresolved),
  };
}

async function getDistinctFilterOptions() {
  const [actions, roles, regions] = await Promise.all([
    Log.distinct('action'),
    Log.distinct('role'),
    Log.distinct('region'),
  ]);

  return { actions: actions.sort(), roles: roles.sort(), regions: regions.sort() };
}

module.exports = {
  bulkInsertLogs,
  getLogs,
  getLogStats,
  getDistinctFilterOptions,
};
