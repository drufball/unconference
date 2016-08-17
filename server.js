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
app.use('/images', express.static('images'));

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

var childProcess = require('child_process');
var fs = require('fs');
var CONFLICT_VALUES = {};
var ROOMS = [20, 10];
var TIME_SLOTS = 5;
var SCHEDULE = initSchedule(ROOMS, TIME_SLOTS);
app.get('/schedule-content', (req, res) => {
    CONFLICT_VALUES = {};
    ROOMS = [20, 10];
    TIME_SLOTS = 5;
    SCHEDULE = initSchedule(ROOMS, TIME_SLOTS);

    var options = { include_docs:true };
    talkdb.allDocs(options).then(response => {
        // console.log("Talk data read - read " + response.rows.length + " talks. Sanitizing data...");
        var talks = [];
        response.rows.forEach(function(element, index, array) {
            talks.push(element.doc);
        });
        computeConflictValues(talks);
        // Sort descending
        talks.sort((a,b) => {
            if(a.likes && b.likes) {
                return b.likes.length - a.likes.length;
            } else if(a.likes) {
                return -1;
            } else if(b.likes) {
                return 1;
            }
            return 0;
        });
        // console.log("Data sanitized. Calling scheduler...");
        main(talks);
        res.sendFile(path.join(__dirname + '/schedule.json'));
    }).catch(err => console.log(err));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

lex.onRequest = app;

lex.listen([80], [443, 5001], function () {
    var protocol = ('requestCert' in this) ? 'https': 'http';
});

function main(unscheduled_talks) {
    var max_talks = ROOMS.length * TIME_SLOTS;
    console.log(max_talks);
    if( unscheduled_talks.length > max_talks) {
        unscheduled_talks = unscheduled_talks.slice(0, max_talks);
    }
    while(unscheduled_talks.length > 0) {
        // Grab the next talk
        var next_talk = unscheduled_talks[0];
        unscheduled_talks = unscheduled_talks.slice(1);

        // Find the first slot with no conflicts
        // Save soft conflict scores in case there's no perfect spots
        // Track whether the current best option is to evict or incur
        // a soft conflict
        var lowest_conflict = Infinity;
        var eviction_index = -1;
        var best_time = -1;
        for( var time = 0; time < SCHEDULE.length; time++ ) {
            var scheduled = SCHEDULE[time];
            var conflict = Infinity;
            // Definitely works
            if( scheduled.length == 0 ) {
                conflict = 0;
                scheduled.push(next_talk);
                break;
            }

            conflict = score(scheduled.concat(next_talk));

            // Also definitely works
            if( conflict == 0 ) {
                scheduled.push(next_talk);
                break;
            }
            // Check to see if this soft conflict is better than
            // anything else tried
            if( conflict < lowest_conflict ) {
                lowest_conflict = conflict;
                eviction_index = -1;
                best_time = time;
            }
            // Try evicting each of the currently scheduled talks
            // to see if that's better
            for( var talk = 0; talk < scheduled.length; talk++ ) {
                var conflict_with_eviction = testEvictions(scheduled[talk], time);
                if( conflict_with_eviction < lowest_conflict ) {
                    lowest_conflict = conflict_with_eviction;
                    eviction_index = talk;
                    best_time = time;
                }
            }
        }
        // Check to see if we found an easy insertion
        if( conflict == 0 ) {
            continue;
        }
        // Perform the action that minimizes conflict
        if(eviction_index < 0) {
            SCHEDULE[best_time].push(next_talk);
        } else {
            var evicted = SCHEDULE[best_time].splice(eviction_index, 1)[0];
            SCHEDULE[best_time].push(next_talk);
            unscheduled_talks.unshift(evicted);
        }
    }
    for( var i = 0; i < SCHEDULE.length; i++ ) {
        console.log("################");
        console.log("# Time slot: " + i + " #");
        console.log("################");
        for( var j = 0; j < SCHEDULE[i].length; j++ ) {
            console.log(SCHEDULE[i][j].title + " - " +  SCHEDULE[i][j].likes);
        }
    }

    fs.writeFileSync('schedule.json', JSON.stringify(generateJSON(SCHEDULE),null,2));
    //console.log(SCHEDULE);

    // var talk1 = {
    //     presenters: ['dknox', 'rbyers', 'nduca'],
    //     likes: [1, 2, 3]
    // };
    // var talk2 = {
    //     presenters: ['dglazkov', 'komoroske', 'bnutter'],
    //     likes: [1, 2, 3, 4, 5]
    // };
    // var talk3 = {
    //     presenters: ['dknox', 'rschoen', 'tjsavage'],
    //     likes: [1, 2]
    // };
    // computeConflictValues([talk1, talk2, talk3]);
    // console.log(CONFLICT_VALUES);
    // console.log(score([talk1]));
    // console.log(score([talk1, talk2, talk3]));
    // console.log(score([talk1, talk2]));
    // console.log(score([talk1, talk3]));
    // console.log(score([talk3, talk2]));
}

// Computes the conflict value for each user
function computeConflictValues(talks) {
    talks.forEach(function(talk) {
        if(talk.likes) {
            talk.likes.forEach(function(user) {
                if(CONFLICT_VALUES[user]) {
                    CONFLICT_VALUES[user]++;
                } else {
                    CONFLICT_VALUES[user] = 1;
                }
            });
        }
    });

    for( var user in CONFLICT_VALUES ) {
        if (!CONFLICT_VALUES.hasOwnProperty(user)) {
            //The current property is not a direct property of p
            continue;
        }
        CONFLICT_VALUES[user] = 1 / CONFLICT_VALUES[user];
    }
}

// Initialize the schedule structure
function initSchedule(rooms, time_slots) {
    var schedule = [];
    for( var i = 0; i < time_slots; i++ ) {
        schedule.push([]);
    }
    return schedule;
}

// Try evicting this thing a bunch
function testEvictions(talk, avoid) {
    var best_score = Infinity;
    for( var time = 0; time < SCHEDULE.length; time++ ) {
        if(time == avoid) {
            continue;
        }
        var candidate_score = score(SCHEDULE[time].concat(talk));
        best_score = candidate_score < best_score ? candidate_score : best_score;
    }
    return best_score;
}

// Checks to see if the list of talks is a feasible config
function score(talks) {
    var conflict = 0;
    // Make sure there aren't too many talks scheduled
    if( talks.length > ROOMS.length ) {
        conflict = Infinity;
        return conflict;
    }
    // Make sure there aren't too many rooms for each capacity
    var lengths = [];
    talks.forEach(function(talk) {
        lengths.push(talk.likes.length);
    });
    lengths.sort((a, b) => { return b - a; });
    ROOMS.forEach(function(val, i) {
        if(val < lengths[i]) {
            conflict = Infinity;
        }
        return true;
    });
    if(conflict > 0) {
        return conflict;
    };

    // Make sure no presenters overlap
    var presenters = [];
    talks.forEach(function(talk, i, arr) {
        if(intersection(presenters, talk.presenters).length > 0) {
            conflict = Infinity;
            return true;
        }
        presenters = presenters.concat(talk.presenters);
    });
    if(conflict > 0) {
        return conflict;
    };

    // Compute any soft conflicts
    talks.forEach(function(talk1, i) {
        talks.forEach(function(talk2, j) {
            if(i < j) {
                var overlap = intersection(talk1.likes, talk2.likes);
                overlap.forEach(function(user) {
                    conflict += CONFLICT_VALUES[user];
                });
            }
        });
    });
    return conflict;
}
function intersection(arr1, arr2) {
    var intersect = [];
    arr1.forEach(function(el, i, arr) {
        if(intersect.indexOf(el) < 0 && arr2.indexOf(el) >= 0) {
            intersect.push(el);
        }
    });
    return intersect;
}

function generateJSON(schedule) {
    var formatted_schedule = {};
    formatted_schedule['rooms'] = [
        {"name":"Main room", "capacity":20},
        {"name":"Side room", "capacity":10}
    ];
    formatted_schedule['slots'] = [
        {"time":"10am", "duration":60, "break":false},
        {"time":"11am", "duration":60, "break":false},
        {"time":"12pm", "duration":60, "break":true},
        {"time":"1pm", "duration":60, "break":false},
        {"time":"2pm", "duration":60, "break":false},
        {"time":"3pm", "duration":30, "break":true},
        {"time":"3:30pm", "duration":60, "break":false}
    ];
    var scheduled_talks = {};
    var talk_index = 0;
    for( var time = 0; time < SCHEDULE.length; time++ ) {
        if(formatted_schedule['slots'][talk_index]['break'] == true) {
            talk_index++;
        }
        var talk_time = formatted_schedule['slots'][talk_index]['time'];
        var rooms = [];
        for( var room = 0; room < SCHEDULE[time].length; room++ ) {
            rooms.push({
                'title': SCHEDULE[time][room].title,
                'presenter': SCHEDULE[time][room].presenters.join(', '),
            });
        }
        scheduled_talks[talk_time] = rooms;
        talk_index++;
    }
    formatted_schedule['talks'] = scheduled_talks;
    return formatted_schedule;
}
