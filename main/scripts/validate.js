/*
  Run this before you push:  node scripts/validate.js

  It extracts the PORTFOLIO data straight out of index.html (it lives
  inline in a <script> block, as `window.PORTFOLIO = {...}`) and checks
  it for the mistakes that would actually break the live site: missing
  ids, dangling folder references, missing image files, duplicate ids.
  Exits with a non-zero code if anything is wrong, so a bad edit is
  caught before it ever goes live.
*/

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const INDEX_PATH = path.join(ROOT, "index.html");

function loadContent() {
  const html = fs.readFileSync(INDEX_PATH, "utf8");

  const match = html.match(/<script>\s*([\s\S]*?window\.PORTFOLIO\s*=[\s\S]*?)<\/script>/);
  if (!match) {
    throw new Error('Could not find a <script> block containing "window.PORTFOLIO = " in index.html');
  }

  const sandbox = {};
  const fn = new Function("window", match[1] + "\nreturn window.PORTFOLIO;");
  return fn(sandbox);
}

function fail(msg) {
  console.error("✗ " + msg);
  process.exitCode = 1;
}

function ok(msg) {
  console.log("✓ " + msg);
}

function main() {
  let data;
  try {
    data = loadContent();
  } catch (e) {
    fail("Could not read PORTFOLIO data out of index.html: " + e.message);
    return;
  }

  if (!data || !Array.isArray(data.FOLDERS) || !Array.isArray(data.PROJECTS)) {
    fail("PORTFOLIO must have FOLDERS and PROJECTS arrays");
    return;
  }

  const folderIds = new Set();
  data.FOLDERS.forEach((f, i) => {
    if (!f.id) fail(`FOLDERS[${i}] is missing "id"`);
    else if (folderIds.has(f.id)) fail(`Duplicate folder id: "${f.id}"`);
    else folderIds.add(f.id);
    if (!f.name) fail(`Folder "${f.id || i}" is missing "name"`);
  });

  const projectIds = new Set();
  data.PROJECTS.forEach((p, i) => {
    const label = p.id || `PROJECTS[${i}]`;

    if (!p.id) fail(`${label} is missing "id"`);
    else if (projectIds.has(p.id)) fail(`Duplicate project id: "${p.id}"`);
    else projectIds.add(p.id);

    if (!p.title) fail(`${label} is missing "title"`);

    if (!Array.isArray(p.folders) || p.folders.length === 0) {
      fail(`${label} must have a non-empty "folders" array`);
    } else {
      p.folders.forEach(fid => {
        if (!folderIds.has(fid)) {
          fail(`${label} references folder id "${fid}" which does not exist in FOLDERS`);
        }
      });
    }

    if (!Array.isArray(p.images) || p.images.length === 0) {
      fail(`${label} has no images listed`);
    } else {
      p.images.forEach(imgPath => {
        const full = path.join(ROOT, imgPath);
        if (!fs.existsSync(full)) {
          fail(`${label} references image that does not exist on disk: ${imgPath}`);
        }
      });
    }
  });

  if (process.exitCode !== 1) {
    ok(`${data.FOLDERS.length} folders, ${data.PROJECTS.length} projects — all references valid.`);
  }
}

main();
