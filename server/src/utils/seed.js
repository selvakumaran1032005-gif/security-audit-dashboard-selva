/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Log = require('../models/Log');

const ACTORS = ['priya.sharma', 'arjun.mehta', 'system.bot', 'lina.k', 'devops.svc', 'guest.user'];
const ROLES = ['admin', 'developer', 'viewer', 'security-analyst', 'system'];
const ACTIONS = ['DELETE_USER', 'LOGIN', 'LOGOUT', 'UPDATE_PERMISSIONS', 'CREATE_RESOURCE', 'EXPORT_DATA', 'FAILED_LOGIN'];
const RESOURCE_TYPES = ['User', 'Database', 'S3Bucket', 'APIKey', 'Server', 'Document'];
const REGIONS = ['ap-south-1', 'us-east-1', 'eu-west-1', 'ap-southeast-2'];
const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const STATUSES = ['Resolved', 'Unresolved', 'Investigating', 'Ignored'];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomIp = () => `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

const COUNT = parseInt(process.argv[2], 10) || 10000;

async function seed() {
  await connectDB();
  console.log(`Generating ${COUNT} sample audit log records...`);

  const docs = [];
  const now = Date.now();

  for (let i = 0; i < COUNT; i += 1) {
    docs.push({
      actor: randomFrom(ACTORS),
      role: randomFrom(ROLES),
      action: randomFrom(ACTIONS),
      resource: `resource-${Math.floor(Math.random() * 5000)}`,
      resourceType: randomFrom(RESOURCE_TYPES),
      ipAddress: randomIp(),
      region: randomFrom(REGIONS),
      severity: randomFrom(SEVERITIES),
      status: randomFrom(STATUSES),
      timestamp: new Date(now - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 90)),
    });
  }

  await Log.deleteMany({});
  const batchSize = 1000;
  for (let i = 0; i < docs.length; i += batchSize) {
    await Log.insertMany(docs.slice(i, i + batchSize), { ordered: false });
    console.log(`Inserted ${Math.min(i + batchSize, docs.length)} / ${docs.length}`);
  }

  console.log('Seeding complete.');
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
