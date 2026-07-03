import { defineConfig } from 'vite';
import { formatBytes, syncPublishedAssets } from './scripts/published-assets.mjs';

function publishedAssetsPlugin() {
  return {
    name: 'published-assets',
    apply: 'build',
    closeBundle() {
      const { assets, removed, totalBytes } = syncPublishedAssets();
      console.log(`published assets: ${assets.length} files, ${formatBytes(totalBytes)}; pruned ${removed.length} files`);
    },
  };
}

export default defineConfig({
  plugins: [publishedAssetsPlugin()],
  build: {
    rollupOptions: {
      input: 'index.html',
    },
  },
});
