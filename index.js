const http = require('http');
const EventEmitter = require('events');
const logger = require('./logger');

class AppServer extends EventEmitter {
constructor() {
super();
this.server = null;
this.port = null;
}
start(port) {
this.port = port;
this.server = http.createServer((req, res) => {
this.emit('request:received', { url: req.url, method: req.method });
if (req.method === 'GET' && req.url.startsWith('/order/')) {
const id = req.url.split('/')[2];
orderHandler.processOrder(id);
}
res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
res.end('Hello from Event-Driven Server!');
});
this.server.listen(port, () => {
this.emit('server:started', port);
});
}
stop() {
if (this.server) {
this.server.close(() => {
this.emit('server:stopped');
});
}
}
}

class OrderHandler extends EventEmitter {
processOrder(orderId) {
this.emit('order:start', orderId);
setTimeout(() => {
this.emit('order:processing', orderId);
setTimeout(() => {
const sum = Math.floor(Math.random() * 900) + 100;
this.emit('order:complete', { orderId, sum });
}, 2000);
}, 2000);
}
}

class UserTracker extends EventEmitter {
trackAction(userId, action, metadata) {
const event = {
userId: userId,
action: action,
timestamp: new Date().toISOString(),
metadata: metadata,
id: Math.random().toString(36).substr(2, 9)
};
this.emit('user:action', event);
}
}

function calculatePi() {
let pi = 0;
let sign = 1;
for (let i = 0; i < 10000000; i++) {
pi += sign / (2 * i + 1);
sign = -sign;
}
return (pi * 4).toFixed(7);
}

const app = new AppServer();
const orderHandler = new OrderHandler();
const userTracker = new UserTracker();

logger.setupLogger(app);

app.on('server:started', (port) => {
console.log(`Сервер запущен на порту ${port}`);
});

app.on('request:received', (data) => {
console.log(`Получен запрос: ${data.method} ${data.url}`);
});

app.on('server:stopped', () => {
console.log('Сервер остановлен');
});

orderHandler.on('order:start', (orderId) => {
console.log(`[order:start] Заказ #${orderId} начат`);
});

orderHandler.on('order:processing', (orderId) => {
console.log(`[order:processing] Заказ #${orderId}: Идёт обработка...`);
});

orderHandler.on('order:complete', (data) => {
const pi = calculatePi();
console.log(`[order:complete] Заказ #${data.orderId} завершён на сумму ${data.sum} руб. PI = ${pi}`);
});

userTracker.on('user:action', (event) => {
console.log(`Пользователь ${event.userId} совершил действие "${event.action}"`);
console.log(`Время: ${event.timestamp}`);
console.log(`ID события: ${event.id}`);
console.log(`Доп. данные: ${JSON.stringify(event.metadata)}`);
console.log('---');
});

app.start(3000);

setTimeout(() => {
app.stop();
}, 10000);

userTracker.trackAction(1, 'login', { ip: '192.168.1.1', browser: 'Chrome' });
userTracker.trackAction(2, 'purchase', { item: 'Книга', price: 500 });
userTracker.trackAction(3, 'logout', { reason: 'timeout' });
