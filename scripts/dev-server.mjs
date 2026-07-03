import { createServer } from 'vite';
import { realpathSync } from 'node:fs';

const host = '127.0.0.1';
const port = Number(process.env.PORT || 5173);
const root = process.cwd();
const realRoot = realpathSync(root);

const server = await createServer({
  root,
  server: {
    host,
    port,
    strictPort: false,
    fs: {
      allow: [root, realRoot],
    },
  },
});

await server.listen();
server.printUrls();

const closeServer = async () => {
  await server.close();
  process.exit(0);
};

process.on('SIGINT', closeServer);
process.on('SIGTERM', closeServer);

await new Promise(() => {});
