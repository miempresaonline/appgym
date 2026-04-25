const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// PLESK CONFIGURATION
// En Plesk/Passenger, es importante que dev = false para producción.
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Plesk Passenger normalmente usa el process.env.PORT automáticamente
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    // Asegurarse de enrutar todo mediante Next.js
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Servidor APPGYM Node.js listo en el puerto: ${port}`);
  });
});
