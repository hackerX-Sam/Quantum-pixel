const https = require('https');
const http = require('http');

module.exports = async (req, res) => {
  // Get the path requested, strip the /api/proxy prefix
  const targetPath = req.query.path || '/';
  const targetUrl = `https://peachweb.io${targetPath}`;

  const protocol = targetUrl.startsWith('https') ? https : http;

  return new Promise((resolve, reject) => {
    const proxyReq = protocol.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)',
        'Accept': '*/*',
        'Accept-Encoding': 'identity',
      }
    }, (proxyRes) => {
      // Forward status and headers
      res.status(proxyRes.statusCode);
      
      const contentType = proxyRes.headers['content-type'] || 'application/octet-stream';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=86400');

      // Stream the response
      proxyRes.pipe(res);
      proxyRes.on('end', resolve);
    });

    proxyReq.on('error', (err) => {
      res.status(502).json({ error: 'Proxy error', message: err.message });
      resolve();
    });
  });
};
