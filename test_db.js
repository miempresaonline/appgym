const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  const cmd = `mysql -u admin_appgym -p'qVXvyx374z*oGld!' bbdd_appgym -e "SELECT id, name, notes, rpe, startTime FROM Workout ORDER BY startTime DESC LIMIT 1; SELECT exerciseId, weight, reps FROM Set WHERE workoutId = (SELECT id FROM Workout ORDER BY startTime DESC LIMIT 1);"`;
  
  conn.exec(cmd, (err, stream) => {
    if (err) throw err;
    let out = '';
    stream.on('close', (code, signal) => {
      console.log(out);
      conn.end();
    }).on('data', (data) => {
      out += data.toString();
    }).stderr.on('data', (data) => {
      console.error('STDERR: ' + data);
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
