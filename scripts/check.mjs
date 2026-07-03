import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { formatBytes, validatePublishedAssets } from './published-assets.mjs';

const root = process.cwd();
const viteBin = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');
const debugPattern = /\b(?:TODO|FIXME|debugger|console\.log|鍚|璁|瑙|鐧|涓|€)\b/u;
const assetPatterns = [
  /(?:src|href)=['"]([^'"]+)['"]/g,
  /url\((?!data:)\s*['"]?([^)'"\\s]+)['"]?\s*\)/g,
  /asset\(\s*['"]([^'"]+)['"]\s*\)/g,
  /['"](\/?assets\/[^'"]+)['"]/g,
  /['"](\/favicon[^'"]+)['"]/g,
];

const sourceScanTargets = ['src', 'public', 'index.html', 'package.json', 'README.md', 'DESIGN.md', 'PRODUCT.md', 'design-qa.md'];
const debugScanTargets = ['src', 'README.md', 'DESIGN.md', 'PRODUCT.md', 'package.json'];

function logStep(message) {
  console.log(`\n== ${message}`);
}

function walk(target, files = []) {
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
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.tmp-') || entry.name.startsWith('qa-edge-profile-')) {
      continue;
    }

    const relative = path.relative(root, path.join(full, entry.name));
    walk(relative, files);
  }

  return files;
}

function getTextFiles(targets, extensions) {
  return targets
    .flatMap((target) => walk(target))
    .filter((file) => extensions.test(file));
}

function runBuild() {
  if (!fs.existsSync(viteBin)) {
    throw new Error(`Missing Vite binary: ${viteBin}`);
  }

  const result = spawnSync(process.execPath, [viteBin, 'build'], {
    cwd: root,
    stdio: 'inherit',
    shell: false,
  });

  if (result.status !== 0) {
    throw new Error(`vite build failed with exit code ${result.status ?? 'unknown'}`);
  }
}

function scanAssetRefs() {
  const files = getTextFiles(sourceScanTargets, /\.(jsx?|tsx?|css|html|json|md)$/i);
  const refs = [];

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');

    for (const pattern of assetPatterns) {
      pattern.lastIndex = 0;
      let match;

      while ((match = pattern.exec(text))) {
        const value = match[1];

        if (!value || /^(https?:|mailto:|tel:|#|javascript:)/i.test(value)) {
          continue;
        }

        if (value.startsWith('/')) {
          refs.push(value.slice(1));
        } else if (value.startsWith('assets/')) {
          refs.push(value);
        }
      }
    }
  }

  const uniqueRefs = [...new Set(refs)];
  const missing = uniqueRefs.filter((relativePath) => {
    return !fs.existsSync(path.join(root, 'public', relativePath)) && !fs.existsSync(path.join(root, relativePath));
  });

  return { total: refs.length, unique: uniqueRefs.length, missing };
}

function scanOptimizedImages() {
  const appFile = path.join(root, 'src', 'App.jsx');
  const app = fs.readFileSync(appFile, 'utf8');
  const mapMatch = app.match(/const OPTIMIZED_IMAGE_SOURCES = new Set\(\[([\s\S]*?)\]\)/);
  const missing = [];
  const sources = mapMatch ? [...mapMatch[1].matchAll(/['"]([^'"]+)['"]/g)].map((match) => match[1]) : [];

  for (const source of sources) {
    const optimized = source.replace('/assets/', '/assets/optimized/').replace(/\.(png|jpe?g)$/i, '.webp').slice(1);

    if (!fs.existsSync(path.join(root, 'public', optimized))) {
      missing.push(`${source} -> /${optimized}`);
    }
  }

  const sourceSetCount = (app.match(/<source[^>]+srcSet/g) || []).length;

  return { sources: sources.length, sourceSetCount, missing };
}

function scanDebugResidue() {
  const files = getTextFiles(debugScanTargets, /\.(jsx?|tsx?|css|html|json|md)$/i);
  const matches = [];

  for (const file of files) {
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);

    lines.forEach((line, index) => {
      if (debugPattern.test(line)) {
        matches.push(`${path.relative(root, file)}:${index + 1}: ${line.trim()}`);
      }
    });
  }

  return matches;
}

function measureBundle() {
  const distAssets = path.join(root, 'dist', 'assets');

  if (!fs.existsSync(distAssets)) {
    return { js: [], css: [] };
  }

  const files = fs.readdirSync(distAssets)
    .filter((name) => /\.(js|css)$/i.test(name))
    .map((name) => {
      const file = path.join(distAssets, name);
      const bytes = fs.statSync(file).size;
      const gzipBytes = gzipSync(fs.readFileSync(file)).length;

      return { name, bytes, gzipBytes };
    });

  return {
    js: files.filter((file) => file.name.endsWith('.js')),
    css: files.filter((file) => file.name.endsWith('.css')),
  };
}

function measurePublishedAssets() {
  const { assets, missing } = validatePublishedAssets({ root });
  const missingInDist = [];
  let totalBytes = 0;

  for (const asset of assets) {
    const distAsset = path.join(root, 'dist', asset);

    if (!fs.existsSync(distAsset)) {
      missingInDist.push(asset);
      continue;
    }

    totalBytes += fs.statSync(distAsset).size;
  }

  return { assets, missing, missingInDist, totalBytes };
}

function formatSize(bytes) {
  return `${(bytes / 1024).toFixed(2)} kB`;
}

try {
  logStep('build');
  runBuild();

  logStep('asset references');
  const assets = scanAssetRefs();
  console.log(`references=${assets.total}, unique=${assets.unique}, missing=${assets.missing.length}`);
  assets.missing.forEach((item) => console.log(`missing asset: ${item}`));

  logStep('published assets');
  const published = measurePublishedAssets();
  console.log(
    `published=${published.assets.length}, payload=${formatBytes(published.totalBytes)}, missingPublic=${published.missing.length}, missingDist=${published.missingInDist.length}`,
  );
  published.missing.forEach((item) => console.log(`missing published source: ${item}`));
  published.missingInDist.forEach((item) => console.log(`missing published dist asset: ${item}`));

  logStep('optimized image map');
  const optimized = scanOptimizedImages();
  console.log(`sources=${optimized.sources}, sourceSetTemplates=${optimized.sourceSetCount}, missingWebp=${optimized.missing.length}`);
  optimized.missing.forEach((item) => console.log(`missing optimized image: ${item}`));

  logStep('debug residue');
  const debugMatches = scanDebugResidue();
  console.log(`matches=${debugMatches.length}`);
  debugMatches.forEach((item) => console.log(item));

  logStep('bundle size');
  const bundle = measureBundle();
  bundle.js.forEach((file) => console.log(`js ${file.name}: ${formatSize(file.bytes)} gzip ${formatSize(file.gzipBytes)}`));
  bundle.css.forEach((file) => console.log(`css ${file.name}: ${formatSize(file.bytes)} gzip ${formatSize(file.gzipBytes)}`));

  const entryJs = bundle.js
    .filter((file) => /^index-.*\.js$/i.test(file.name))
    .reduce((total, file) => total + file.gzipBytes, 0);
  const totalJs = bundle.js.reduce((total, file) => total + file.gzipBytes, 0);

  if (entryJs > 115 * 1024) {
    throw new Error(`entry JS gzip budget exceeded: ${formatSize(entryJs)} > 115.00 kB`);
  }

  if (totalJs > 180 * 1024) {
    throw new Error(`total JS gzip budget exceeded: ${formatSize(totalJs)} > 180.00 kB`);
  }

  if (published.totalBytes > 35 * 1024 * 1024) {
    throw new Error(`published asset payload exceeded: ${formatBytes(published.totalBytes)} > 35.00 MB`);
  }

  if (
    assets.missing.length ||
    published.missing.length ||
    published.missingInDist.length ||
    optimized.missing.length ||
    debugMatches.length
  ) {
    throw new Error('check failed: missing assets, optimized images, published assets, or debug residue found');
  }

  console.log('\ncheck passed');
} catch (error) {
  console.error(`\ncheck failed: ${error.message}`);
  process.exit(1);
}
