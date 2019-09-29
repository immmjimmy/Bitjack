var client = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/'

//Specify the Amazon DocumentDB cert
//var ca = [fs.readFileSync("rds-combined-ca-bundle.pem")];

var sHand = [getCard(), getCard()];
var dHand = [];
var pot = 0;
var queue = [];

const dbName = 'BitJack'
const sHandID = 1;
const dHandID = 2;
const potID = 3;
const queueID = 4;
const leaderboardID = 5;

function exists(col, paramID, genericFunction) {
    let result = col.find({'id': paramID});

    result.toArray(function(err, result){
        if (result.length > 0) {
            genericFunction(true);
        } else {
            genericFunction(false);
        }
    });
}

function getDocument(col, paramID, genericFunction) {
    let result = col.find({'id': paramID});

    result.toArray(function(err, result){
        genericFunction(result);
    });
}

function getLeaderboard(streamerName) { 
    client.connect(url, function(err, client) {
        db = client.db(dbName);
        col = db.collection(streamerName);

        let result = col.find({'id': leaderboardID});
        getDocument(col, leaderboardID, function(result) {
            client.close();
            return new Promise(
                function(resolve, reject) {
                    if (result.length > 0) {
                        resolve(result);
                    } else {
                        reject('No results');
                    }
                }
            );
        });
    });
}

function setLeaderboard(streamerName, leaderboard) {
    client.connect(url, function(err, client) {
        db = client.db(dbName);
        col = db.collection(streamerName);

        exists(col, leaderboardID, function(booleanboy) {
            console.log(booleanboy);
            if (booleanboy) {
                col.updateOne({'id': leaderboardID}, {'Leaderboard': leaderboard, 'id': leaderboardID}, function(err, result){
                    //console.log(result);
                });
            } else {
                col.insertOne({'Leaderboard': leaderboard, 'id': leaderboardID}, function(err, result) {
                    //console.log(result);
                });
            }
    
            client.close();
            return 'Ok';
        });
    });
}

function getStreamHand(streamerName) {
    client.connect(url, function(err, client) {
        db = client.db(dbName);
        col = db.collection(streamerName);

        let result = col.find(
            { },
            {'StreamHand': 1, _id: 0 });

        client.close();
        return result;
    });
}

function setStreamHand(streamerName, streamHand) {
    client.connect(url, function(err, client) {
        db = client.db(dbName);
        col = db.collection(streamerName);
    
        col.insertOne({'StreamHand': streamHand}, function(err, result) {
            console.log(result);
        });
        client.close();
        return 'Ok';
    });
}

function getDealerHand(streamerName) {
    client.connect(url, function(err, client) {
        db = client.db(dbName);
        col = db.collection(streamerName);
    
        let result = col.find(
            { },
            {'DealerHand': 1, _id: 0});
        client.close();
        return result;
    });
}

function setDealerHand(streamerName, dealerHand) {
    client.connect(url, function(err, client) {
        db = client.db(dbName);
        col = db.collection(streamerName);
    
        col.insertOne({'DealerHand': dealerHand}, function(err, result) {
            console.log(result);
        });
    
        client.close();
        return 'Ok';
    });
}

function getQueue(streamerName) {
    client.connect(url, function(err, client) {
        db = client.db(dbName);
        col = db.collection(streamerName);
    
        let result = col.find(
            { },
            {'Queue': 1, _id: 0});
    
        client.close();
        return result;
    });
}

function setQueue(streamerName, queue) {
    client.connect(url, function(err, client) {
        db = client.db(dbName);
        col = db.collection(streamerName);
    
        col.insertOne({'Queue': queue}, function(err, result) {
            console.log(result);
        });
    
        client.close();
        return 'Ok';
    });
}

function getPot(streamerName) {
    client.connect(url, function(err, client) {
        db = client.db(dbName);
        col = db.collection(streamerName);
    
        let result = col.find(
            { },
            {'Pot': 1, _id: 0});
        
        client.close();
        return result;
    });
}

function setPot(streamerName, pot) {
    client.connect(url, function(err, client) {
        db = client.db(dbName);
        col = db.collection(streamerName);
    
        col.insertOne({'Pot': pot}, function(err, result) {
            console.log(result);
        });
    
        client.close();
        return 'Ok';
    });
}

// No need to open client below this point because we open it in our get and sets
function startGame(streamerName) {
    sHand = [getCard(), getCard()];
    initDealer(streamerName);
    pot = 0;
    queue = [];

    setStreamHand(streamerName, sHand);
    setDealerHand(streamerName, dHand);
    setPot(streamerName, pot);
    setQueue(streamerName, queue);

    return 'Ok';
}

// No need to open client below this point because we open it in our get and sets
function hit(streamerName, userName) {
    let playerHand = getStreamHand(streamerName);
    let gameQueue = getQueue(streamerName);

    sHand = nullCheck(sHand, playerHand);
    queue = nullCheck(queue, gameQueue);

    sHand.push(getCard());

    let sValue = handValue(sHand);
    if (sValue > 21) {
        pBust(streamerName)
    } else if (sValue == 21) {
        win(streamerName, userName);
    }

    queue.shift();
    setQueue(streamerName, queue);
    
    return 'Ok';
}

// No need to open client below this point because we open it in our get and sets
function stand(streamerName, userName) {
    let playerHand = getStreamHand(streamerName);
    let dealerHand = getDealerHand(streamerName);
    let gameQueue = getQueue(streamerName);

    sHand = nullCheck(sHand, playerHand);
    dHand = nullCheck(dHand, dealerHand);
    queue = nullCheck(queue, gameQueue);

    while(handValue(dHand)<17){
        dHand.push(getCard());
    }

    if (handValue(sHand) <= handValue(dHand)) {
        pBust(streamerName);
    } else {
        win(streamerName, userName);
    }

    queue.shift();
    setQueue(streamerName, queue);

    return 'Ok';
}

// No need to open client below this point because we open it in our get and sets
function win(streamerName, userName) {
    let gamePot = getPot(streamerName);

    pot = nullCheck(pot, gamePot);
    
    insertUser(streamerName, userName);
    pot = 0;
    sHand = [getCard(), getCard()];
    initDealer(streamerName);
    
    setStreamHand(streamerName, sHand);
    setDealerHand(streamerName, dHand);
    setPot(streamerName, pot);

    return 'Ok';
}

// No need to open client below this point because we open it in our get and sets
function insertUser(streamerName, userName) {
    let leaderboard = getLeaderboard(streamerName);

    if (leaderboard) {
        leaderboard = [];
        leaderboard.push([username, pot]);
    } else {
        let index = leaderboard.indexof(userName);

        if (index >= 0) {
            leaderboard[index][1] += pot;
            let temp = leader[index];
            leaderboard.splice(index, 1);
            for (let i = 0; i < leaderboard.length; i++) {
                if (leaderboard[i][1] < pot) {
                    leaderboard.splice(i, 0, temp);
                }
            }
        } else {
            for (let i = 0; i < leaderboard.length; i++) {
                if (leaderboard[i][1] < pot) {
                    leaderboard.splice(i, 0, [username, pot]);
                }
            }
        }
    }

    setLeaderboard(streamerName, leaderboard);

    return 'Ok';
}

function pBust(streamerName) {
    let playerHand = getStreamHand(streamerName);
    let dealerHand = getDealerHand(streamerName);
    let gamePot = getPot(streamerName);

    sHand = nullCheck(sHand, playerHand);
    dHand = nullCheck(dHand, dealerHand);
    pot = nullCheck(pot, gamePot);

    insertUser(streamerName, streamerName);

    pot = 0;
    sHand = [getCard(), getCard()];
    initDealer(streamerName);

    setPot(streamerName, pot);
    setStreamHand(streamerName, sHand);
    setDealerHand(streamerName, dHand);

    return 'Ok';
}

function handValue(hand) {
    let sum = 0;
    let aces = 0;

    for (let i = 0; i < hand.length; i++) {
        let value = cardValue(hand[i]);
        if (value == 1) {
            aces = aces + 1;
        } else {
            sum = value;
        }
    }

    sum = sum + aces - 1;
    if (sum < 11) {
        return sum + 11;
    }
}

function cardValue(card) {
    card = (card % 13) + 1;
    card = Math.min(card, 10);
    if (card == 1) {
        return 11;
    } else {
        return card;
    }
}

function cardSuit(card) {
    return int(card / 13);
}

function getCard() {
    return Math.floor(Math.random() * 52);
}

function initDealer(streamerName) {
    dHand = [getCard(), getCard()];
    if (handValue(dHand) == 21) {
        initDealer(streamerName);
    } else {
        setDealerHand(streamerName, dHand);
    }
}

function nullCheck(local, db) {
    if (db) {
        return db;
    }
    return local;
}

function initialize(streamerName) {
    // initDealer(streamerName);
    setLeaderboard(streamerName, []);
    // setStreamHand(streamerName, sHand);
    // setDealerHand(streamerName, dHand);
    // setQueue(streamerName, queue);
    // setPot(streamerName, pot);
}

function closeConnect() {
    client.close();
}

exports.getLeaderboard = getLeaderboard;
exports.closeConnect = closeConnect;
exports.initialize = initialize;
exports.initDealer = initDealer;
exports.pBust = pBust;
exports.win = win;
exports.stand = stand;
exports.hit = hit;
exports.startGame = startGame;
exports.setPot = setPot;
exports.getPot = getPot;
exports.setQueue = setQueue;
exports.getQueue = getQueue;
exports.setDealerHand = setDealerHand;
exports.getDealerHand = getDealerHand;
exports.setStreamHand = setStreamHand;
exports.getStreamHand = getStreamHand;
exports.setLeaderboard = setLeaderboard;
