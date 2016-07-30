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
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

// Database setup
var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
app.use('/db', require('express-pouchdb')(PouchDB));

// Databases
var talkdb = new PouchDB('talks');
var userdb = new PouchDB('users');

app.use('/src', express.static('src'));
app.use('/polymer', express.static('polymer'));

// Database helpers
function add_talk(data) {
    return new Promise((fulfill, refect) => {
        talkdb.post(data).then(response => {
            fulfill(response);
        }).catch(error => {
            reject(error);
        });
    });
}
function get_talks(limit) {
    return new Promise((fulfill, reject) => {
        if(limit === "all") {
            var options = {limit:10, include_docs: true};
            talkdb.allDocs(options, function (err, response) {
                if (err == null) {
                    fulfill(response);
                } else {
                    console.log(error);
                    reject(err);
                }
            });
        }
        else {
            reject("Single access not yet supported");
        }
    });
}
function add_user(data) {
    return new Promise((fulfill, reject) => {
        console.log("adding user: " + data.username);
        userdb.createIndex({
            index: {
                fields: ['username']
            }
        })
        .then(result => {
            userdb.find({
                selector: { username:data.username }
            })
            .then(result => {
                if(result.docs.length > 0) {
                    console.log("existing user");
                    var response = {}
                    response.ok = true;
                    response.id = result.docs[0]._id;
                    response.rev = result.docs[0]._rev;
                    console.log(response);
                    fulfill(response);
                } else {
                    console.log("new user");
                    userdb.post(data).then(response => {
                        fulfill(response);
                    }).catch(error => {
                        reject(error);
                    });
                }
            })
            .catch(error => {
                console.log(error);
                reject(error);
            });
        });
    });
}

// TODO: make sure npm install works for pouchdb
// TODO: switch add talks to post from get

// Database endpoints
app.post('/talks/add', (req, res) => {
    add_talk(req.body)
    .then(result => {
        res.status(201).send(result);
    }).catch(error => {
        res.status(500).send(error);
    });
});
app.post('/talks/update', (req, res) => {
    if(req.body) {
        console.log("Updating a document");
        console.log(req.body);
        talkdb.put(req.body)
        .then(response => {
            res.status(201).send(response);
        })
        .catch(error => {
            res.status(500).send(error);
        });
    } else {
        console.log("no body specified");
    }
});
app.get('/talks/view/:talk', (req, res) => {
    get_talks(req.params.talk)
    .then(result => {
        res.json(result);
    }).catch(error => {
        res.send(error);
    });
});
app.post('/user/add', (req, res) => {
    add_user(req.body)
    .then(result => {
        res.status(201).send(result);
    }).catch(error => {
        res.status(500).send(error);
    });
});

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
        res.send("<div>" + renderedMD + "</div>");
    });
});

app.get('/schedule-content', (req, res) => {
    res.sendFile(path.join(__dirname + '/schedule.json'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

lex.onRequest = app;

lex.listen([80], [443, 5001], function () {
    var protocol = ('requestCert' in this) ? 'https': 'http';
});
