import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const portfolioRoot = path.join(repositoryRoot, 'apps', 'portfolio-hub');

export const collectImageReferences = (source) => {
  const references = [];
  const imagePathCall = /imagePath\(\s*(['"`])([^'"`]+)\1\s*\)/g;
  for (const match of source.matchAll(imagePathCall)) {
    references.push({
      fileName: match[2],
      line: source.slice(0, match.index).split(/\r?\n/).length,
    });
  }
  return references;
};

export const validateAssetReferences = ({ references, publicImagesDir, distImagesDir = null }) => {
  const problems = [];
  const seen = new Set();

  for (const { fileName, line } of references) {
    const location = `App.jsx:${line}`;
    if (seen.has(fileName)) {
      problems.push(`${location}: duplicate image reference '${fileName}'`);
      continue;
    }
    seen.add(fileName);

    if (path.basename(fileName) !== fileName || fileName.includes('\\') || fileName.includes('..')) {
      problems.push(`${location}: malformed local image path '${fileName}'`);
      continue;
    }

    const publicPath = path.join(publicImagesDir, fileName);
    if (!fs.existsSync(publicPath) || !fs.statSync(publicPath).isFile()) {
      problems.push(`${location}: referenced image is missing from public/images: '${fileName}'`);
    }

    if (distImagesDir) {
      const distPath = path.join(distImagesDir, fileName);
      if (!fs.existsSync(distPath) || !fs.statSync(distPath).isFile()) {
        problems.push(`${location}: referenced image is missing from dist/images: '${fileName}'`);
      }
    }
  }

  return problems;
};

export const validatePortfolioAssets = ({ appRoot = portfolioRoot, checkBuilt = false, builtRoot = null } = {}) => {
  const sourcePath = path.join(appRoot, 'src', 'App.jsx');
  const publicImagesDir = path.join(appRoot, 'public', 'images');
  const distImagesDir = checkBuilt ? path.join(builtRoot || path.join(appRoot, 'dist'), 'images') : null;
  const source = fs.readFileSync(sourcePath, 'utf8');
  const references = collectImageReferences(source);
  return {
    references,
    problems: validateAssetReferences({ references, publicImagesDir, distImagesDir }),
  };
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const checkBuilt = process.argv.includes('--built');
    const builtRootArgumentIndex = process.argv.indexOf('--built-dir');
    const builtRoot = builtRootArgumentIndex >= 0 ? process.argv[builtRootArgumentIndex + 1] : null;
    if (builtRootArgumentIndex >= 0 && !builtRoot) throw new Error('--built-dir requires a directory');
    const result = validatePortfolioAssets({ checkBuilt: checkBuilt || Boolean(builtRoot), builtRoot: builtRoot ? path.resolve(builtRoot) : null });
    if (result.problems.length > 0) {
      console.error('Portfolio image integrity check failed:');
      for (const problem of result.problems) console.error(`- ${problem}`);
      process.exitCode = 1;
    } else {
      const target = checkBuilt ? 'public/images and dist/images' : 'public/images';
      console.log(`Portfolio image integrity check passed for ${result.references.length} referenced images in ${target}.`);
    }
  } catch (error) {
    console.error(`Portfolio image integrity check could not run: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}
