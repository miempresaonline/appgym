const { Client } = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec('tail -n 100 /var/www/vhosts/appgym.es/logs/error_log', (err, stream) => {
    if (err) throw err;
    stream.on('close', () => conn.end()).on('data', data => console.log(data.toString())).stderr.on('data', data => console.error(data.toString()));
  });
}).connect({ host: '62.171.141.30', port: 22, username: 'appgym.es_z6pbi3nyrn', password: '6x6ZHu7yC!' });
