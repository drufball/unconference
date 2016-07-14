'use strict';

if(process.env.PROD === "true") { // production deployment
    console.log("Production deployment detected...");
    var LEX = require('letsencrypt-express').testing();
} else { // dev deployment
    console.log("Dev deployment detected");
    var LEX = require('letsencrypt-express').testing();
}

var DOMAIN = 'unconference.io';
var EMAIL = 'dknox@google.com';

var lex = LEX.create({
    configDir: require('os').homedir() + '/letsencrypt/etc',
    approveRegistration: function(hostname, approve) {
        if(hostname === DOMAIN || hostname === 'localhost') {
            approve(null, {
                domains: [DOMAIN],
                email: EMAIL,
                agreeTos: true
            });
        }
    }
});

var express = require('express');
var path = require('path');

var app = express();

app.use('/src', express.static('src'));
app.use('/polymer', express.static('polymer'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

lex.onRequest = app;

lex.listen([80], [443, 5001], function () {
    var protocol = ('requestCert' in this) ? 'https': 'http';
});
