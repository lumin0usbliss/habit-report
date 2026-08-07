const http = require('http');
http.get('http://localhost:3000/result/123', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => { console.log('STATUS:', resp.statusCode); console.log(data.substring(0, 500)); });
}).on('error', (err) => { console.log('Error: ' + err.message); });
