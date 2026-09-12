const fs = require('fs');
const path = require('path');
function setupLogger(app) {
const logFile = path.join(__dirname, 'logs.txt');
function writeLog(event, data) {
const time = new Date().toISOString();
const line = `[${time}] ${event}: ${JSON.stringify(data)}\n`;
fs.appendFile(logFile, line, (err) => {
if (err) console.error('Ошибка записи в лог:', err);
});
}
app.on('server:started', (port) => writeLog('server:started', { port }));
app.on('server:stopped', () => writeLog('server:stopped', {}));
app.on('request:received', (data) => writeLog('request:received', data));
}
module.exports = { setupLogger };
