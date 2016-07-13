var express = require('express');
var path = require('path');

var app = express();

console.log("SERVER IS FUCKING RUNNING");

app.use('/src', express.static('src'));
app.use('/polymer', express.static('polymer'));

app.get('/health', (req, res) => {
    res.sendStatus(200);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(process.env.PORT, function() {
    console.log("listening on " + process.env.PORT);
});
