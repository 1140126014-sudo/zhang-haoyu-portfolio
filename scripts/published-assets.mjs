import fs from 'node:fs';
import path from 'node:path';

const sourceScanTargets = ['src', 'public', 'index.html'];
const textFilePattern = /\.(jsx?|tsx?|css|html|json|md)$/i;
const assetPatterns = [
  /(?:src|href|poster)=['"]([^'"]+)['"]/g,
  /url\((?!data:)\s*['"]?([^)'"\\s]+)['"]?\s*\)/g,
  /asset\(\s*['"]([^'"]+)['"]\s*\)/g,
  /['"](\/?assets\/[^'"]+)['"]/g,
  /['"](\/favicon[^'"]+)['"]/g,
];

function walk(root, target, files = []) {
  const full = path.join(root, target);

  if (!fs.existsSync(full)) {
    return files;
  }

  const stat = fs.statSync(full);

  if (stat.isFile()) {
    files.push(full);
    return files;
  }

  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    if (
      entry.name === 'node_modules' ||
      entry.name === 'dist' ||
      entry.name.startsWith('.tmp-') ||
      entry.name.startsWith('qa-edge-profile-')
    ) {
      continue;
    }

    walk(root, path.relative(root, path.join(full, entry.name)), files);
  }

  return files;
}

function normalizePublicRef(value) {
  if (!value || /^(https?:|mailto:|tel:|#|javascript:)/i.test(value)) {
    return null;
  }

  const withoutQuery = value.split(/[?#]/)[0];

  if (withoutQuery.startsWith('/')) {
    const relative = withoutQuery.slice(1);
    if (!path.extname(relative)) {
      return null;
    }

    return relative.startsWith('assets/') || relative.startsWith('favicon') ? relative : null;
  }

  if (withoutQuery.startsWith('assets/') || withoutQuery.startsWith('favicon')) {
    return path.extname(withoutQuery) ? withoutQuery : null;
  }

  return null;
}

export function toOptimizedAssetPath(source) {
  return source
    .replace(/^\/?assets\//, 'assets/optimized/')
    .replace(/\.(png|jpe?g)$/i, '.webp');
}

export function getOptimizedImageSources({ root = process.cwd() } = {}) {
  const appFile = path.join(root, 'src', 'App.jsx');

  if (!fs.existsSync(appFile)) {
    return new Set();
  }

  const app = fs.readFileSync(appFile, 'utf8');
  const mapMatch = app.match(/const OPTIMIZED_IMAGE_SOURCES = new Set\(\[([\s\S]*?)\]\)/);

  if (!mapMatch) {
    return new Set();
  }

  return new Set([...mapMatch[1].matchAll(/['"]([^'"]+)['"]/g)].map((match) => match[1]));
}

export function collectAssetReferences({ root = process.cwd() } = {}) {
  const refs = [];
  const files = sourceScanTargets
    .flatMap((target) => walk(root, target))
    .filter((file) => textFilePattern.test(file));

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');

    for (const pattern of assetPatterns) {
      pattern.lastIndex = 0;
      let match;

      while ((match = pattern.exec(text))) {
        const normalized = normalizePublicRef(match[1]);

        if (normalized) {
          refs.push(normalized);
        }
      }
    }
  }

  return [...new Set(refs)].sort();
}

export function collectPublishedAssets({ root = process.cwd() } = {}) {
  const optimizedSources = getOptimizedImageSources({ root });
  const optimizedSourceRefs = new Set([...optimizedSources].map((source) => source.replace(/^\//, '')));
  const assets = new Set();

  for (const ref of collectAssetReferences({ root })) {
    if (optimizedSourceRefs.has(ref)) {
      assets.add(toOptimizedAssetPath(ref));
    } else {
      assets.add(ref);
    }
  }

  for (const source of optimizedSources) {
    assets.add(toOptimizedAssetPath(source));
  }

  return [...assets].sort();
}

export function validatePublishedAssets({ root = process.cwd() } = {}) {
  const assets = collectPublishedAssets({ root });
  const missing = assets.filter((asset) => !fs.existsSync(path.join(root, 'public', asset)));

  return { assets, missing };
}

export function copyPublishedAssets({ root = process.cwd(), outDir = 'dist' } = {}) {
  const { assets, missing } = validatePublishedAssets({ root });

  if (missing.length) {
    throw new Error(`Missing published assets: ${missing.join(', ')}`);
  }

  let totalBytes = 0;

  for (const asset of assets) {
    const source = path.join(root, 'public', asset);
    const destination = path.join(root, outDir, asset);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
    totalBytes += fs.statSync(source).size;
  }

  return { assets, totalBytes };
}

export function pruneUnpublishedAssets({ root = process.cwd(), outDir = 'dist', assets = null } = {}) {
  const publishList = assets ?? collectPublishedAssets({ root });
  const keep = new Set(publishList.map((asset) => asset.replaceAll('\\', '/')));
  const distRoot = path.join(root, outDir);
  const distAssets = path.join(distRoot, 'assets');
  const removed = [];

  if (!fs.existsSync(distAssets)) {
    return removed;
  }

  function pruneDirectory(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        pruneDirectory(absolute);

        if (fs.existsSync(absolute) && fs.readdirSync(absolute).length === 0) {
          fs.rmdirSync(absolute);
        }

        continue;
      }

      const relative = path.relative(distRoot, absolute).replaceAll('\\', '/');

      if (keep.has(relative) || /\.(?:js|css|map)$/i.test(entry.name)) {
        continue;
      }

      fs.rmSync(absolute);
      removed.push(relative);
    }
  }

  pruneDirectory(distAssets);
  return removed;
}

export function syncPublishedAssets({ root = process.cwd(), outDir = 'dist' } = {}) {
  const copied = copyPublishedAssets({ root, outDir });
  const removed = pruneUnpublishedAssets({ root, outDir, assets: copied.assets });

  return { ...copied, removed };
}

export function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} kB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
