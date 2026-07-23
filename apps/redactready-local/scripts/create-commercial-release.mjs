import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const appRoot = process.cwd();
const packageJson = JSON.parse(readFileSync(path.join(appRoot, "package.json"), "utf8"));

if (packageJson.name !== "redactready-local") {
  throw new Error(
    `Run this script from apps/redactready-local. Found package ${packageJson.name || "unknown"}.`,
  );
}

const version = packageJson.version;
if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(version)) {
  throw new Error(`package.json contains an invalid release version: ${version}`);
}

const productName = "RedactReady Local";
const packageName = `RedactReady-Local-Implementation-Kit-v${version}`;
const zipName = `${packageName}-Payhip.zip`;
const canonicalDemoUrl =
  "https://ai-project-portfolio-redactready-lo.vercel.app/";
const desktop = path.join(os.homedir(), "Desktop");
const releaseRoot = existsSync(desktop)
  ? path.join(desktop, "RedactReady-Local-Release")
  : path.join(appRoot, "RedactReady-Local-Release");
const reviewDir = path.join(releaseRoot, "unzipped-review-copy", packageName);
const payhipZip = path.join(releaseRoot, "upload-to-payhip", zipName);
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const excludedNames = new Set([
  ".git",
  ".vercel",
  "coverage",
  "dist",
  "node_modules",
  "playwright-report",
  "release",
  "test-results",
  "RedactReady-Local-Release",
]);

const textExtensions = new Set([
  ".css",
  ".csv",
  ".env",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".svg",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: appRoot,
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit",
    shell: process.platform === "win32",
    ...options,
  });
  if (result.status !== 0) {
    const details = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    throw new Error(
      `${command} ${args.join(" ")} failed with exit code ${result.status}${
        details ? `:\n${details}` : ""
      }`,
    );
  }
  return options.capture ? result.stdout.trim() : "";
}

function git(...args) {
  return run("git", args, { capture: true });
}

function ensureCleanSource() {
  const status = git("status", "--porcelain");
  if (status) {
    throw new Error(
      "Refusing to create a commercial package from a dirty Git working tree. Commit or stash all repository changes first.",
    );
  }
}

function shouldExclude(absolutePath) {
  const relative = path.relative(appRoot, absolutePath).replaceAll("\\", "/");
  if (!relative || relative === ".") return false;
  const parts = relative.split("/");
  if (parts.some((part) => excludedNames.has(part))) return true;
  const base = path.basename(absolutePath);
  if (base === "create_docs.cjs") return true;
  if (base.startsWith(".env") && base !== ".env.example") return true;
  if (base.endsWith(".log")) return true;
  if (base === "tsconfig.tsbuildinfo" || base === ".DS_Store") return true;
  return false;
}

function copyFiltered(from, to) {
  if (shouldExclude(from)) return;
  const stats = statSync(from);
  if (stats.isDirectory()) {
    mkdirSync(to, { recursive: true });
    for (const entry of readdirSync(from)) {
      copyFiltered(path.join(from, entry), path.join(to, entry));
    }
    return;
  }
  mkdirSync(path.dirname(to), { recursive: true });
  cpSync(from, to);
}

function walkFiles(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(absolute, files);
    else files.push(absolute);
  }
  return files;
}

function sha256(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

function writeText(file, content) {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${content.trim()}\n`, "utf8");
}

function writeJson(file, value) {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function scanForSecrets(dir) {
  const secretPattern =
    /(sk-[A-Za-z0-9_-]{20,}|sk-proj-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|xox[baprs]-[A-Za-z0-9-]{20,}|BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY)/i;
  const findings = [];
  for (const file of walkFiles(dir)) {
    if (!textExtensions.has(path.extname(file).toLowerCase())) continue;
    const content = readFileSync(file, "utf8");
    if (secretPattern.test(content)) {
      findings.push(path.relative(dir, file).replaceAll("\\", "/"));
    }
  }
  if (findings.length) {
    throw new Error(`Possible secrets detected in package:\n${findings.join("\n")}`);
  }
}

function createZip(folder, zipPath) {
  mkdirSync(path.dirname(zipPath), { recursive: true });
  rmSync(zipPath, { force: true });
  const command = [
    "import pathlib, shutil",
    `folder = pathlib.Path(${JSON.stringify(folder)})`,
    `zip_path = pathlib.Path(${JSON.stringify(zipPath)})`,
    "shutil.make_archive(str(zip_path.with_suffix('')), 'zip', str(folder.parent), folder.name)",
  ].join("\n");
  run("python", ["-c", command]);
  if (!existsSync(zipPath)) throw new Error(`ZIP was not created: ${zipPath}`);
}

function extractZip(zipPath, destination) {
  mkdirSync(destination, { recursive: true });
  const command = [
    "import pathlib, zipfile",
    `zip_path = pathlib.Path(${JSON.stringify(zipPath)})`,
    `destination = pathlib.Path(${JSON.stringify(destination)})`,
    "with zipfile.ZipFile(zip_path, 'r') as archive:",
    "    archive.extractall(destination)",
  ].join("\n");
  run("python", ["-c", command]);
}

function writeFileManifest(packageDir) {
  const manifest = path.join(packageDir, "FILES-SHA256.txt");
  rmSync(manifest, { force: true });
  const lines = walkFiles(packageDir)
    .filter((file) => file !== manifest)
    .map((file) => {
      const relative = path.relative(packageDir, file).replaceAll("\\", "/");
      return `${sha256(file)}  ${relative}`;
    })
    .sort();
  writeText(
    manifest,
    `# SHA-256 hashes for every package file except this manifest itself.\n${lines.join(
      "\n",
    )}`,
  );
}

function validateFileManifest(packageDir) {
  const manifest = path.join(packageDir, "FILES-SHA256.txt");
  const entries = readFileSync(manifest, "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const match = line.match(/^([a-f0-9]{64})  (.+)$/);
      if (!match) throw new Error(`Invalid checksum line: ${line}`);
      return { expected: match[1], relative: match[2] };
    });

  for (const entry of entries) {
    const file = path.join(packageDir, ...entry.relative.split("/"));
    if (!existsSync(file)) throw new Error(`Manifest file is missing: ${entry.relative}`);
    if (sha256(file) !== entry.expected) {
      throw new Error(`Checksum mismatch for ${entry.relative}`);
    }
  }
}

function validateRequiredFiles(packageDir) {
  const required = [
    "START-HERE.md",
    "COMMERCIAL-PACKAGE.md",
    "LICENSE",
    "README.md",
    "RELEASE.json",
    "FILES-SHA256.txt",
    "source/package.json",
    "source/README.md",
    "source/LICENSE",
    "source/SETUP.md",
    "source/VERIFICATION.md",
    "source/LIMITATIONS.md",
    "source/MANUAL_QA_CHECKLIST.md",
  ];
  const missing = required.filter((relative) => !existsSync(path.join(packageDir, relative)));
  if (missing.length) {
    throw new Error(`Required package files are missing:\n${missing.join("\n")}`);
  }
}

function createBuyerDocs(packageDir, source) {
  const appReadme = readFileSync(path.join(appRoot, "README.md"), "utf8");
  const license = readFileSync(path.join(appRoot, "LICENSE"), "utf8");

  writeText(
    path.join(packageDir, "START-HERE.md"),
    `# Start Here — RedactReady Local

This package is a curated, provenance-recorded implementation kit for RedactReady Local ${version}.

## Important License Boundary

The included application source is licensed under the MIT License. Your purchase pays for the curated release package, buyer-oriented documentation, synthetic samples, release verification materials, and packaging work. It does not create exclusive ownership of the MIT-licensed source and does not revoke rights already granted under MIT.

Read \`LICENSE\` and \`COMMERCIAL-PACKAGE.md\` before use.

## Safe First Run

1. Open the \`source/\` folder.
2. Run \`npm ci\`.
3. Run \`npm run dev\`.
4. Open the local URL printed by Vite.
5. Use only the included synthetic samples first.
6. Review the limitations before processing any real file.

## Verification

From \`source/\`:

\`\`\`bash
npm run lint
npm run test
npm run build
npm run e2e
\`\`\`

Playwright browsers must be installed for the end-to-end suite.

## Canonical Demo

${canonicalDemoUrl}

The public demo is for product evaluation. Use synthetic files unless you have independently verified the deployment and privacy model for your intended data.

## Human Review Requirement

RedactReady Local is an assistive privacy-review workflow. It does not guarantee detection, complete redaction, metadata removal, legal adequacy, regulatory compliance, or security. Open and inspect every exported file before sharing it.`,
  );

  writeText(
    path.join(packageDir, "COMMERCIAL-PACKAGE.md"),
    `# Commercial Package Boundary

## What This Purchase Provides

- A clean, versioned RedactReady Local source snapshot.
- Source commit and release metadata in \`RELEASE.json\`.
- Per-file SHA-256 values in \`FILES-SHA256.txt\`.
- Buyer-oriented setup and verification guidance.
- Synthetic test samples included with the application.
- A package that was built from a clean Git working tree after lint, unit-test, and production-build verification.

## MIT-Licensed Source

The application source is distributed under the MIT License included in this package. MIT permits use, copying, modification, publication, distribution, sublicensing, and sale subject to its notice requirements.

This commercial package therefore does not promise exclusivity, prevent lawful redistribution under MIT, or grant rights that contradict the included license.

## What Is Not Included

- Legal advice or compliance certification.
- Guaranteed detection or guaranteed redaction.
- Guaranteed metadata sanitization.
- Managed hosting, private infrastructure, or data-processing agreements.
- Custom implementation, integrations, or support commitments unless separately agreed in writing.
- Exclusive ownership of the existing MIT-licensed source.

## Responsible Use

Use synthetic samples first. Validate network behavior, browser support, export behavior, OCR behavior, and final-file inspection before using the application in a real workflow.`,
  );

  writeFileSync(path.join(packageDir, "README.md"), appReadme, "utf8");
  writeFileSync(path.join(packageDir, "LICENSE"), license, "utf8");

  writeJson(path.join(packageDir, "RELEASE.json"), {
    schemaVersion: 1,
    product: productName,
    releaseVersion: version,
    packageName,
    packageType: "Curated implementation and deployment kit",
    sourceLicense: "MIT",
    commercialBoundary:
      "Purchase covers packaging, documentation, verification materials, and delivery; it does not confer exclusivity over MIT-licensed source.",
    canonicalDemoUrl,
    sourceRepository: source.repository,
    sourceCommit: source.commit,
    sourceBranch: source.branch,
    sourceTag: source.tag || null,
    sourceClean: true,
    generatedAt: source.generatedAt,
    nodeVersion: process.version,
    platform: `${process.platform}-${process.arch}`,
    verification: {
      lintPassedBeforePackaging: true,
      unitTestsPassedBeforePackaging: true,
      productionBuildPassedBeforePackaging: true,
      e2eRequiresSeparateRecordedRun: true,
      perFileSha256Manifest: "FILES-SHA256.txt",
    },
  });
}

ensureCleanSource();

const source = {
  repository: git("config", "--get", "remote.origin.url"),
  commit: git("rev-parse", "HEAD"),
  branch: git("branch", "--show-current") || "detached",
  tag: git("tag", "--points-at", "HEAD").split(/\r?\n/).filter(Boolean)[0] || null,
  generatedAt: new Date().toISOString(),
};

run(npmCommand, ["run", "lint"]);
run(npmCommand, ["run", "test"]);
run(npmCommand, ["run", "build"]);

rmSync(releaseRoot, { recursive: true, force: true });
mkdirSync(path.join(reviewDir, "source"), { recursive: true });

copyFiltered(appRoot, path.join(reviewDir, "source"));

const sampleSource = path.join(appRoot, "public", "samples");
if (existsSync(sampleSource)) {
  cpSync(sampleSource, path.join(reviewDir, "synthetic-samples"), {
    recursive: true,
    force: true,
  });
}

createBuyerDocs(reviewDir, source);
scanForSecrets(reviewDir);
writeFileManifest(reviewDir);
validateRequiredFiles(reviewDir);
validateFileManifest(reviewDir);

createZip(reviewDir, payhipZip);

const verificationDir = mkdtempSync(
  path.join(os.tmpdir(), "redactready-release-verify-"),
);
try {
  extractZip(payhipZip, verificationDir);
  const extractedPackage = path.join(verificationDir, packageName);
  validateRequiredFiles(extractedPackage);
  validateFileManifest(extractedPackage);
  const metadata = JSON.parse(
    readFileSync(path.join(extractedPackage, "RELEASE.json"), "utf8"),
  );
  if (
    metadata.releaseVersion !== version ||
    metadata.sourceCommit !== source.commit ||
    metadata.sourceLicense !== "MIT"
  ) {
    throw new Error("Extracted release metadata does not match the source release.");
  }
} finally {
  rmSync(verificationDir, { recursive: true, force: true });
}

const zipSha256 = sha256(payhipZip);
writeText(
  path.join(releaseRoot, "CHECKSUMS.txt"),
  `# SHA-256 Checksums\n\n${zipSha256}  upload-to-payhip/${zipName}`,
);
writeJson(path.join(releaseRoot, "RELEASE-INTEGRITY.json"), {
  schemaVersion: 1,
  product: productName,
  releaseVersion: version,
  packageName,
  source,
  canonicalDemoUrl,
  reviewCopy: {
    path: `unzipped-review-copy/${packageName}`,
    fileCount: walkFiles(reviewDir).length,
  },
  payhipArchive: {
    path: `upload-to-payhip/${zipName}`,
    bytes: statSync(payhipZip).size,
    sha256: zipSha256,
  },
  verification: {
    cleanGitSourceRequired: true,
    lintPassed: true,
    unitTestsPassed: true,
    productionBuildPassed: true,
    possibleSecretScanPassed: true,
    requiredFilesPassed: true,
    perFileHashesValidated: true,
    archiveExtractedAndValidated: true,
    buyerPathDownloadHashPending: true,
    e2eEvidencePendingUnlessRunSeparately: true,
  },
});

console.log("");
console.log("RedactReady commercial implementation kit created.");
console.log(`Source commit: ${source.commit}`);
console.log(`Release version: ${version}`);
console.log(`Payhip ZIP: ${payhipZip}`);
console.log(`Payhip SHA-256: ${zipSha256}`);
console.log(
  "Remaining seller verification: run and record E2E, upload the exact ZIP, then download it through Payhip and match the SHA-256.",
);
