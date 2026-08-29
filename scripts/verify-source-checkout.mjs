import { execFileSync } from 'node:child_process';
import { appendFileSync, writeFileSync } from 'node:fs';

const requiredString = (value, label) => {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} is required.`);
  return value.trim();
};

export function verifySourceCheckout({ expectedSourceSha, actualSourceSha, status }) {
  const expected = requiredString(expectedSourceSha, 'Expected source SHA');
  const actual = requiredString(actualSourceSha, 'Checked-out source SHA');
  if (typeof status !== 'string') throw new Error('Source status is required.');
  const clean = status.trim().length === 0;
  const evidence = {
    schemaVersion: 1,
    expectedSourceSha: expected,
    actualSourceSha: actual,
    clean,
  };

  if (actual !== expected) {
    throw new Error(`Checked-out source SHA ${actual} does not match expected source SHA ${expected}.`);
  }
  if (!clean) throw new Error('Source checkout is not clean.');

  return evidence;
}

const parseArguments = (argv) => {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!argument.startsWith('--')) continue;
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${argument}.`);
    options[argument.slice(2)] = value;
    index += 1;
  }
  return options;
};

if (import.meta.url === `file://${process.argv[1].replaceAll('\\', '/')}`) {
  const options = parseArguments(process.argv.slice(2));
  const expectedSourceSha = requiredString(options['expected-source-sha'], 'Expected source SHA');
  const output = requiredString(options.output, 'Evidence output');
  const actualSourceSha = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const status = execFileSync('git', ['status', '--porcelain=v1', '--untracked-files=all'], { encoding: 'utf8' });
  const evidence = {
    schemaVersion: 1,
    expectedSourceSha,
    actualSourceSha,
    clean: status.trim().length === 0,
  };

  writeFileSync(output, `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(`Resolved source SHA: ${actualSourceSha}`);
  console.log(JSON.stringify(evidence));

  const verifiedEvidence = verifySourceCheckout({ expectedSourceSha, actualSourceSha, status });
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `source-sha=${verifiedEvidence.actualSourceSha}\n`);
}
