import EventEmitter from 'events';

class SyncManager extends EventEmitter {
  constructor() {
    super();
    this.clients = new Set();
    this.version = Date.now();
    this.lastModified = new Date().toISOString();
    this.lastType = 'initial';

    // Send keepalive comments every 20 seconds to prevent reverse proxy/load-balancer timeouts
    setInterval(() => {
      this.sendKeepAlive();
    }, 20000);
  }

  handleSSE(req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*',
    });

    res.write(`data: ${JSON.stringify({ type: 'connected', version: this.version, time: this.lastModified })}\n\n`);

    this.clients.add(res);

    req.on('close', () => {
      this.clients.delete(res);
    });
  }

  sendKeepAlive() {
    for (const client of this.clients) {
      try {
        client.write(': keepalive\n\n');
      } catch (err) {
        this.clients.delete(client);
      }
    }
  }

  notifyDataChange(type, action = 'update', details = {}) {
    this.version = Date.now();
    this.lastModified = new Date().toISOString();
    this.lastType = type;

    const payload = JSON.stringify({
      type,
      action,
      version: this.version,
      time: this.lastModified,
      details,
    });

    for (const client of this.clients) {
      try {
        client.write(`event: data-change\ndata: ${payload}\n\n`);
      } catch (err) {
        this.clients.delete(client);
      }
    }

    this.emit('change', { type, action, version: this.version });
  }

  getVersion() {
    return {
      version: this.version,
      lastModified: this.lastModified,
      lastType: this.lastType,
      clientsConnected: this.clients.size,
    };
  }
}

export const syncManager = new SyncManager();
export default syncManager;
