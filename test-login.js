const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/mini-app/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(JSON.stringify({
      role: 'user',
      warehouseId: '1',
      timestamp: Date.now().toString(),
      signature: 'test-signature'
    }))
  }
};

const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log(`响应头: ${JSON.stringify(res.headers)}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(`请求遇到问题: ${e.message}`);
});

req.write(JSON.stringify({
  role: 'user',
  warehouseId: '1',
  timestamp: Date.now().toString(),
  signature: 'test-signature'
}));
req.end();