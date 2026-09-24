setTimeout(() => {
console.log('1. setTimeout');
}, 0);
setImmediate(() => {
console.log('2. setImmediate');
});
process.nextTick(() => {
console.log('3. process.nextTick');
});
Promise.resolve().then(() => {
console.log('4. Promise.then');
});
console.log('5. Синхронный код');
/* 5 - синхронный код, выполняется первым. 3 - process.nextTrick приоритет среди асинхронных, 4 - Promise.then микроазадчи, 1 - setTimeout фаза таймерс, 2 setImmediate - фаза чек */
