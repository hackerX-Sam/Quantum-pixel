const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;

app.use((req, res, next) => {
  const localPath = path.join(__dirname, req.path);
  
  if (req.path === '/' || req.path === '') {
      return next();
  }

  if (fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
    next();
  } else {
    // If file doesn't exist locally, proxy it from peachweb.io
    console.log('Proxying missing file from peachweb.io:', req.path);
    createProxyMiddleware({
      target: 'https://peachweb.io',
      changeOrigin: true,
      logLevel: 'silent',
      onProxyRes: function (proxyRes, req, res) {
        // Optionally save the file locally for future requests
        if (proxyRes.statusCode === 200 && (req.path.endsWith('.js') || req.path.endsWith('.json') || req.path.endsWith('.css'))) {
            try {
                // Ensure directory exists
                const dir = path.dirname(localPath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                const file = fs.createWriteStream(localPath);
                proxyRes.pipe(file);
                console.log('Downloaded and saved locally:', req.path);
            } catch (err) {
                console.error('Error saving file locally:', err.message);
            }
        }
      }
    })(req, res, next);
  }
});

// Serve local files
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Development proxy server running at http://127.0.0.1:${PORT}`);
  console.log(`It will serve local files, and automatically download missing scripts/assets from peachweb.io.`);
});
