const fs = require('fs');
console.log('Start');
fs.readFile('hello.txt', function (err, data) {
    if (err) {
        return console.error(err);
    }
    console.log(data.toString());
});
console.log('End');
