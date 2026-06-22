const mongoose = require('mongoose');
const { SEVERITY_LEVELS, LOG_STATUSES } = require('../config/constants');

const logSchema = new mongoose.Schema(
  {
    actor: {
      type: String,
      required: [true, 'actor is required'],
      trim: true,
      maxlength: 200,
    },
    role: {
      type: String,
      required: [true, 'role is required'],
      trim: true,
      maxlength: 100,
    },
    action: {
      type: String,
      required: [true, 'action is required'],
      trim: true,
      uppercase: true,
      maxlength: 150,
    },
    resource: {
      type: String,
      required: [true, 'resource is required'],
      trim: true,
      maxlength: 300,
    },
    resourceType: {
      type: String,
      required: [true, 'resourceType is required'],
      trim: true,
      maxlength: 100,
    },
    ipAddress: {
      type: String,
      required: [true, 'ipAddress is required'],
      trim: true,
      // basic IPv4 / IPv6 validation, kept permissive on purpose
      match: [/^([0-9a-fA-F:.]+)$/, 'ipAddress must be a valid IP address'],
    },
    region: {
      type: String,
      required: [true, 'region is required'],
      trim: true,
      maxlength: 50,
    },
    severity: {
      type: String,
      required: [true, 'severity is required'],
      enum: {
        values: SEVERITY_LEVELS,
        message: 'severity must be one of LOW, MEDIUM, HIGH, CRITICAL',
      },
    },
    status: {
      type: String,
      required: [true, 'status is required'],
      enum: {
        values: LOG_STATUSES,
        message: 'status must be one of Resolved, Unresolved, Investigating, Ignored',
      },
      default: 'Unresolved',
    },
    timestamp: {
      type: Date,
      required: [true, 'timestamp is required'],
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Single-field indexes for common filter/sort targets
logSchema.index({ actor: 1 });
logSchema.index({ action: 1 });
logSchema.index({ severity: 1 });
logSchema.index({ status: 1 });
logSchema.index({ timestamp: -1 });

// Compound indexes for frequent filter combinations + sort
logSchema.index({ severity: 1, timestamp: -1 });
logSchema.index({ status: 1, timestamp: -1 });
logSchema.index({ region: 1, timestamp: -1 });

// Text index to support the global search bar across key fields
logSchema.index(
  { actor: 'text', action: 'text', resource: 'text', ipAddress: 'text' },
  { name: 'log_search_index', weights: { actor: 5, action: 3, resource: 2, ipAddress: 1 } }
);

module.exports = mongoose.model('Log', logSchema);
