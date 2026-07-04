import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ignoredDirectories = new Set([
  '.git',
  '.netlify',
  '.vercel',
  '_archive',
  'coverage',
  'dist',
  'node_modules',
  'playwright-report',
  'test-results',
]);

const ignoredPathParts = [
  `${path.sep}docs${path.sep}superpowers${path.sep}`,
];

function walk(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    const relativePath = path.relative(root, fullPath);

    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        files.push(...walk(fullPath));
      }
      continue;
    }

    const isIncludedMarkdown =
      entry.isFile() &&
      entry.name.toLowerCase().endsWith('.md') &&
      !ignoredPathParts.some((part) => fullPath.includes(part)) &&
      !relativePath.startsWith(`apps${path.sep}`);

    if (isIncludedMarkdown) {
      files.push(fullPath);
    }
  }

  return files;
}

function appMarkdownFiles() {
  const appsDirectory = path.join(root, 'apps');
  if (!fs.existsSync(appsDirectory)) return [];

  return fs.readdirSync(appsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const appDirectory = path.join(appsDirectory, entry.name);
      return fs.readdirSync(appDirectory, { withFileTypes: true })
        .filter((file) => file.isFile() && file.name.toLowerCase().endsWith('.md'))
        .map((file) => path.join(appDirectory, file.name));
    });
}

function markdownFiles() {
  const rootDocs = walk(root).filter((file) => {
    const relativePath = path.relative(root, file);
    return !relativePath.startsWith(`apps${path.sep}`);
  });

  return [...new Set([...rootDocs, ...appMarkdownFiles()])].sort();
}

function isExternalLink(target) {
  return /^(?:https?:|mailto:|tel:)/i.test(target);
}

function localTargetFor(markdownFile, rawTarget) {
  const withoutTitle = rawTarget.trim().replace(/^<|>$/g, '').split(/\s+(?=(?:"|'))/)[0];
  const withoutAnchor = withoutTitle.split('#')[0].split('?')[0];

  if (!withoutAnchor || withoutAnchor.startsWith('#') || isExternalLink(withoutAnchor)) {
    return null;
  }

  return path.resolve(path.dirname(markdownFile), decodeURIComponent(withoutAnchor));
}

const problems = [];
const linkPattern = /!?\[[^\]]*]\(([^)]+)\)/g;

for (const markdownFile of markdownFiles()) {
  const markdown = fs.readFileSync(markdownFile, 'utf8');
  const relativeMarkdownFile = path.relative(root, markdownFile);
  let match;

  while ((match = linkPattern.exec(markdown)) !== null) {
    const target = localTargetFor(markdownFile, match[1]);
    if (target && !fs.existsSync(target)) {
      problems.push(`${relativeMarkdownFile} -> ${match[1]}`);
    }
  }
}

if (problems.length > 0) {
  console.error('Broken local Markdown links found:');
  for (const problem of problems) {
    console.error(`- ${problem}`);
  }
  process.exit(1);
}

console.log(`Checked local Markdown links in ${markdownFiles().length} files.`);
