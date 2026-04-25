const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('cd /var/www/vhosts/appgym.es/httpdocs && export NODE_ENV=production && export PORT=3000 && /opt/plesk/node/24/bin/node server.js', (err, stream) => {
    if (err) throw err;
    stream.on('close', () => conn.end()).on('data', data => console.log(data.toString())).stderr.on('data', data => console.error(data.toString()));
    
    // Stop after 5 seconds since it's a server
    setTimeout(() => {
      conn.exec('pkill -f "node server.js"', () => conn.end());
    }, 5000);
  });
}).connect({ host: '62.171.141.30', port: 22, username: 'appgym.es_z6pbi3nyrn', password: '6x6ZHu7yC!' });
