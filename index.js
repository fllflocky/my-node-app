const http = require('http');
function calculatePi() {
  let n = 22;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += Math.pow(-1, i) / (2 * i + 1);
  }
  return sum * 4;
}
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  const name = 'Шинель Милана Андреевна';
  const group = '478';
  const pi = calculatePi();
  res.end(
    '<h1>Информация о студенте</h1>' +
    '<p><strong>ФИО:</strong> ' + name + '</p>' +
    '<p><strong>Группа:</strong> ' + group + '</p>' +
    '<p><strong>Число Пи:</strong> ' + pi + '</p>'
  );
});
server.listen(3000, function() {
  console.log('Сервер на http://localhost:3000');
});
