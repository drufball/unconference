var express = require('express');
var path = require('path');

var app = express();

app.use('/src', express.static('src'));
app.use('/polymer', express.static('polymer'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(process.env.PORT);
