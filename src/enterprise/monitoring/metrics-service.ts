import http from 'http';
import client from 'prom-client';

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const requestCount = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
});

export class MetricsService {
  static startServer(port = 9100) {
    http.createServer(async (req, res) => {
      if (req.url === '/metrics') {
        res.writeHead(200, { 'Content-Type': client.register.contentType });
        res.end(await client.register.metrics());
      } else {
        requestCount.inc();
        res.writeHead(404);
        res.end();
      }
    }).listen(port);
  }
} 