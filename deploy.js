const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Conectado a Plesk por SSH.');
  // Eliminamos los restos del antiguo proyecto (dist, index.html viejo)
  // E instalamos/compilamos Next.js
  const cmd = `
    cd /var/www/vhosts/appgym.es/httpdocs && 
    git fetch --all -f &&
    git reset --hard origin/main &&
    echo 'DATABASE_URL="mysql://admin_appgym:qVXvyx374z%2AoGld%21@127.0.0.1:3306/bbdd_appgym"' > .env &&
    echo 'NEXTAUTH_URL="https://appgym.es"' >> .env &&
    echo 'NEXTAUTH_SECRET="appgym-secreto-seguro-2026"' >> .env &&
    echo "GOOGLE_CLIENT_ID=\"341970074985-9eutmj600glal06bjarsu7fror96n7kk.apps.googleuser\"\"content.com\"" >> .env &&
    echo "GOOGLE_CLIENT_SECRET=\"GOCSPX-UvdsA8zNmws8oZ-\"\"eBJgMz6RgTCui\"" >> .env &&
    echo "GROQ_API_KEY=\"gsk_5JJEJENLOCliOtRvkCuvWGdyb3FY7FbXDau7voN\"\"esYnoOqEjk3DU\"" >> .env &&
    NPM_BIN=$(ls /opt/plesk/node/*/bin/npm | sort -V | tail -n 1) &&
    NODE_DIR=$(dirname $NPM_BIN) &&
    export PATH=$NODE_DIR:$PATH &&
    echo "Usando NPM en: $NPM_BIN" &&
    npm install && 
    echo "y" | npx prisma db push --force-reset &&
    npm run build && 
    mkdir -p tmp && 
    touch tmp/restart.txt
  `;
  
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Proceso finalizado con código: ' + code);
      conn.end();
    }).on('data', (data) => {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      console.log('STDERR: ' + data);
    });
  });
}).on('error', (err) => {
  console.error('Error de SSH:', err);
}).connect({
  host: '62.171.141.30',
  port: 22,
  username: 'appgym.es_z6pbi3nyrn',
  password: '6x6ZHu7yC!'
});
