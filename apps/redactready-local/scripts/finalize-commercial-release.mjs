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
const version = packageJson.version;
const packageName = `RedactReady-Local-Implementation-Kit-v${version}`;
const zipName = `${packageName}-Payhip.zip`;
const desktop = path.join(os.homedir(), "Desktop");
const releaseRoot = existsSync(desktop)
  ? path.join(desktop, "RedactReady-Local-Release")
  : path.join(appRoot, "RedactReady-Local-Release");
const reviewDir = path.join(releaseRoot, "unzipped-review-copy", packageName);
const zipPath = path.join(releaseRoot, "upload-to-payhip", zipName);

const buyerDocs = [
  "SETUP.md",
  "VERIFICATION.md",
  "LIMITATIONS.md",
  "MANUAL_QA_CHECKLIST.md",
  "FEATURE_STATUS.md",
  "TECHNICAL_ARCHITECTURE.md",
  "PORTFOLIO_CASE_STUDY.md",
];

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: appRoot,
    encoding: "utf8",
    stdio: "inherit",
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status}`);
  }
}

function walkFiles(dir, files = []) {
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
  writeFileSync(
    manifest,
    `# SHA-256 hashes for every package file except this manifest itself.\n${lines.join(
      "\n",
    )}\n`,
    "utf8",
  );
}

function validateFileManifest(packageDir) {
  const manifest = path.join(packageDir, "FILES-SHA256.txt");
  for (const line of readFileSync(manifest, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([a-f0-9]{64})  (.+)$/);
    if (!match) throw new Error(`Invalid checksum line: ${line}`);
    const file = path.join(packageDir, ...match[2].split("/"));
    if (!existsSync(file)) throw new Error(`Manifest file missing: ${match[2]}`);
    if (sha256(file) !== match[1]) throw new Error(`Checksum mismatch: ${match[2]}`);
  }
}

function createZip(folder, target) {
  rmSync(target, { force: true });
  mkdirSync(path.dirname(target), { recursive: true });
  const command = [
    "import pathlib, shutil",
    `folder = pathlib.Path(${JSON.stringify(folder)})`,
    `target = pathlib.Path(${JSON.stringify(target)})`,
    "shutil.make_archive(str(target.with_suffix('')), 'zip', str(folder.parent), folder.name)",
  ].join("\n");
  run("python", ["-c", command]);
}

function extractZip(source, destination) {
  const command = [
    "import pathlib, zipfile",
    `source = pathlib.Path(${JSON.stringify(source)})`,
    `destination = pathlib.Path(${JSON.stringify(destination)})`,
    "destination.mkdir(parents=True, exist_ok=True)",
    "with zipfile.ZipFile(source, 'r') as archive:",
    "    archive.extractall(destination)",
  ].join("\n");
  run("python", ["-c", command]);
}

if (!existsSync(reviewDir) || !existsSync(zipPath)) {
  throw new Error(
    "The base RedactReady commercial package is missing. Run create-commercial-release.mjs first.",
  );
}

for (const documentName of buyerDocs) {
  const source = path.join(appRoot, documentName);
  if (existsSync(source)) cpSync(source, path.join(reviewDir, documentName));
}

for (const required of [
  "SETUP.md",
  "VERIFICATION.md",
  "LIMITATIONS.md",
  "MANUAL_QA_CHECKLIST.md",
]) {
  if (!existsSync(path.join(reviewDir, required))) {
    throw new Error(`Buyer document missing after finalization: ${required}`);
  }
}

writeFileManifest(reviewDir);
validateFileManifest(reviewDir);
createZip(reviewDir, zipPath);

const validationRoot = mkdtempSync(path.join(os.tmpdir(), "redactready-final-verify-"));
try {
  extractZip(zipPath, validationRoot);
  const extracted = path.join(validationRoot, packageName);
  validateFileManifest(extracted);
  for (const required of [
    "SETUP.md",
    "VERIFICATION.md",
    "LIMITATIONS.md",
    "MANUAL_QA_CHECKLIST.md",
  ]) {
    if (!existsSync(path.join(extracted, required))) {
      throw new Error(`Final archive is missing buyer document: ${required}`);
    }
  }
} finally {
  rmSync(validationRoot, { recursive: true, force: true });
}

const zipHash = sha256(zipPath);
writeFileSync(
  path.join(releaseRoot, "CHECKSUMS.txt"),
  `# SHA-256 Checksums\n\n${zipHash}  upload-to-payhip/${zipName}\n`,
  "utf8",
);

const integrityPath = path.join(releaseRoot, "RELEASE-INTEGRITY.json");
const integrity = JSON.parse(readFileSync(integrityPath, "utf8"));
integrity.reviewCopy.fileCount = walkFiles(reviewDir).length;
integrity.payhipArchive.bytes = statSync(zipPath).size;
integrity.payhipArchive.sha256 = zipHash;
integrity.verification.buyerRootDocumentationCopied = true;
integrity.verification.finalArchiveRebuiltAndRevalidated = true;
writeFileSync(integrityPath, `${JSON.stringify(integrity, null, 2)}\n`, "utf8");

console.log("RedactReady buyer documentation and final archive were finalized.");
console.log(`Payhip ZIP: ${zipPath}`);
console.log(`Payhip SHA-256: ${zipHash}`);
