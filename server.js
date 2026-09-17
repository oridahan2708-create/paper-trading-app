#!/usr/bin/env node
// Self-hosting entry point for the web build (dist/client + dist/server,
// produced by `npm run build:web`). Serves the static client bundle and the
// /api/* proxy routes (see app/api/**/+api.ts) from one plain Node process —
// deployable to any Node host (Render, Railway, Fly.io, a VPS, etc.), no
// framework-specific adapter required.
const path = require('path');
const { createRequestHandler } = require('@expo/server/adapter/express');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');

const CLIENT_BUILD_DIR = path.join(process.cwd(), 'dist/client');
const SERVER_BUILD_DIR = path.join(process.cwd(), 'dist/server');

const app = express();
app.use(compression());
app.disable('x-powered-by');
process.env.NODE_ENV = 'production';

app.use(morgan('tiny'));
app.use(express.static(CLIENT_BUILD_DIR, { maxAge: '1h', extensions: ['html'] }));
// Express 5's router requires named wildcards ('*splat' rather than bare '*').
app.all('/{*splat}', createRequestHandler({ build: SERVER_BUILD_DIR }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`SocialTrade web server listening on http://localhost:${port}`);
});
