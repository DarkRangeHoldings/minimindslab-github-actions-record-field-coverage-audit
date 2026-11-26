import { appendFileSync } from 'node:fs';

const payloadRaw = process.env.INPUT_PAYLOAD;
const outputPath = process.env.GITHUB_OUTPUT;

let payload;
try {
  payload = JSON.parse(payloadRaw);
} catch {
  throw new Error('Invalid input');
}

if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
  throw new Error('Invalid input');
}

const { records, field } = payload;

if (!Array.isArray(records) || typeof field !== 'string' || field.length === 0) {
  throw new Error('Invalid input');
}

let missing = 0;
let nulls = 0;
let present = 0;

for (let i = 0; i < records.length; i++) {
  const rec = records[i];
  if (rec === null || typeof rec !== 'object' || Array.isArray(rec)) {
    throw new Error('Invalid input');
  }
  if (Object.prototype.hasOwnProperty.call(rec, field)) {
    present++;
    if (rec[field] === null) nulls++;
  } else {
    missing++;
  }
}

const result = { missing, nulls, present, total: records.length };
appendFileSync(outputPath, `result=${JSON.stringify(result)}\n`);