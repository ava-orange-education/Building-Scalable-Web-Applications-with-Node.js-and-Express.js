const fs = require('fs');
console.log('Start');
const data = fs.readFileSync('hello.txt');
console.log(data.toString());
console.log('End');

