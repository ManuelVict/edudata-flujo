/**
 * EduData Flujo - Production Server for Hostinger & Node.js
 * Compatible with Express and zero-dependency Node.js native HTTP fallback.
 */

const path = require('path');
const fs = require('fs');

const PORT = parseInt(process.env.PORT || '3000', 10);
const DIST_DIR = path.join(__dirname, 'dist');

// Try to use Express if installed, otherwise fallback to native http
let useExpress = false;
try {
  require.resolve('express');
  useExpress = true;
} catch (e) {
  useExpress = false;
}

if (useExpress) {
  const express = require('express');
  const app = express();

  // Health check endpoint for Hostinger / Cloud monitoring
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
  });

  // Serve static assets with caching
  app.use(express.static(DIST_DIR, {
    maxAge: '1h',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }));

  // Fallback for SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });

  const server = app.listen(PORT, () => {
    console.log(`[EduData Flujo] Servidor Express corriendo en puerto ${PORT}`);
    console.log(`[EduData Flujo] Sirviendo contenido desde: ${DIST_DIR}`);
  });

  process.on('SIGTERM', () => server.close());
  process.on('SIGINT', () => server.close());
} else {
  // Zero-dependency native Node.js HTTP fallback
  const http = require('http');

  const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };

  const server = http.createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() }));
      return;
    }

    const cleanUrl = req.url.split('?')[0];
    let filePath = path.join(DIST_DIR, cleanUrl === '/' ? 'index.html' : cleanUrl);

    // Security check: ensure path is within DIST_DIR
    if (!filePath.startsWith(DIST_DIR)) {
      res.writeHead(403);
      res.end('Acceso denegado');
      return;
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        filePath = path.join(DIST_DIR, 'index.html');
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      fs.readFile(filePath, (readErr, content) => {
        if (readErr) {
          res.writeHead(500);
          res.end('Error interno del servidor');
          return;
        }

        const headers = { 'Content-Type': contentType };
        if (ext === '.html') {
          headers['Cache-Control'] = 'no-cache';
        } else {
          headers['Cache-Control'] = 'public, max-age=3600';
        }

        res.writeHead(200, headers);
        res.end(content);
      });
    });
  });

  server.listen(PORT, () => {
    console.log(`[EduData Flujo] Servidor nativo Node.js corriendo en puerto ${PORT}`);
    console.log(`[EduData Flujo] Sirviendo contenido desde: ${DIST_DIR}`);
  });

  process.on('SIGTERM', () => server.close());
  process.on('SIGINT', () => server.close());
}
