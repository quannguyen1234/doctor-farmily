import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import * as path from 'path';

/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.resolve();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }]
  }
});
