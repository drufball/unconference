'use strict';

if(process.env.PROD === "true") { // production deployment
    console.log("Production deployment detected...");
    var LEX = require('letsencrypt-express');
} else { // dev deployment
    console.log("Dev deployment detected");
    var LEX = require('letsencrypt-express').testing();
}

var DOMAIN = 'unconference.io';
var EMAIL = 'dknox@google.com';

console.log('Will use ' + require('os').homedir() + '/letsencrypt/etc for cert');
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
        console.log("approving");
    }
});

var express = require('express');
var path = require('path');

var app = express();

app.use('/src', express.static('src'));
app.use('/polymer', express.static('polymer'));

app.get('/readme-content', (req, res) => {
    var readline = require('readline');
    var fs = require('fs');
    var renderedMD = "";
    var marked = require('marked');

    var rl = readline.createInterface({
        input: fs.createReadStream('README.md')
    });

    rl.on('line', (line) => {
        while(line.includes('<')) {
            line = line.replace('<', '&#60;');
        }
        while(line.includes('>')) {
            line = line.replace('>', '&#62;');
        }
        renderedMD += marked(line);
    });

    rl.on('close', () => {
        console.log(renderedMD);
        res.send("<div>" + renderedMD + "</div>");
    });


    // var fs = require('fs');
    // fs.readFile('README.md', (err, data) => {
    //
    //     marked.setOptions({
    //         gfm: false
    //     });
    //     console.log("returning " + __dirname + '/readme-content.html');
    //     marked(data.toString(), (err, content) => {
    //         if(err) throw err;
    //         res.send(content);
    //     });
    // });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

lex.onRequest = app;

lex.listen([80], [443, 5001], function () {
    var protocol = ('requestCert' in this) ? 'https': 'http';
});
