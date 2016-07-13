var express = require('express');
var path = require('path');

var app = express();

app.use('/src', express.static('src'));
app.use('/bower_components', express.static('bower_components'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
