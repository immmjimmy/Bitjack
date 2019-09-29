var MongoClient = require('mongodb').MongoClient,
  f = require('util').format,
  fs = require('fs');

//Specify the Amazon DocumentDB cert
var ca = [fs.readFileSync("rds-combined-ca-bundle.pem")];

var sHand = [getCard(), getCard()];
var dHand = [];
var pot = 0;
var queue = [];

const dbName = 'BitJack'

//Create a MongoDB client, open a connection to Amazon DocumentDB as a replica set, 
//  and specify the read preference as secondary preferred
var client = MongoClient.connect(
'mongodb://galaxybrain:galaxybrain@bitsjack.cluster-czqwuwhieohk.us-east-2.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0', 
{ 
  sslValidate: false,
  sslCA:ca,
  ssl:true,
  useNewUrlParser: true
},
function(err, client) {
    if(err)
        throw err;
});


function getLeaderboard(streamerName) { 
    db = client.db(dbName);
    col = db.collection(streamerName);

    return col.find(
        { },
        {'Leaderboard': 1, _id: 0 });
}

function setLeaderboard(streamerName, leaderboard) {
    db = client.db(dbName);
    col = db.collection(streamerName);

    col.insertOne({'Leaderboard': leaderboard}, function(err, result) {
        console.log(result);
    });
}

function getStreamHand(streamerName) {
    db = client.db(dbName);
    col = db.collection(streamerName);

    return col.find(
        { },
        {'StreamHand': 1, _id: 0 });
}

function setStreamHand(streamerName, streamHand) {
    db = client.db(dbName);
    col = db.collection(streamerName);

    col.insertOne({'StreamHand': streamHand}, function(err, result) {
        console.log(result);
    });
}

function getDealerHand(streamerName) {
    db = client.db(dbName);
    col = db.collection(streamerName);

    return col.find(
        { },
        {'DealerHand': 1, _id: 0});
}

function setDealerHand(streamerName, dealerHand) {
    db = client.db(dbName);
    col = db.collection(streamerName);

    col.insertOne({'DealerHand': dealerHand}, function(err, result) {
        console.log(result);
    });
}

function getQueue(streamerName) {
    db = client.db(dbName);
    col = db.collection(streamerName);

    return col.find(
        { },
        {'Queue': 1, _id: 0});
}

function setQueue(streamerName, queue) {
    db = client.db(dbName);
    col = db.collection(streamerName);

    col.insertOne({'Queue': queue}, function(err, result) {
        console.log(result);
    });
}

function getPot(streamerName) {
    db = client.db(dbName);
    col = db.collection(streamerName);

    return col.find(
        { },
        {'Pot': 1, _id: 0});
}

function setPot(streamerName, pot) {
    db = client.db(dbName);
    col = db.collection(streamerName);

    col.insertOne({'Pot': pot}, function(err, result) {
        console.log(result);
    });
}

function startGame(streamerName) {
    db = client.db(dbName);
    col = db.collection(streamerName);

    sHand = [getCard(), getCard()];
    initDealer();
    pot = 0;
    queue = [];

    setStreamHand(streamerName, sHand);
    setDealerHand(streamerName, dHand);
    setPot(streamerName, pot);
    setQueue(streamerName, queue);
}

function hit(streamerName, userName) {
    db = client.db(dbName);
    col = db.collection(streamerName);

    let playerHand = getStreamHand(streamerName);
    let gameQueue = getQueue(streamerName);

    sHand.push(getCard());
    let sValue = handValue(sHand);

    if (sValue > 21) {
        pBust(streamerName)
    } else if (sValue == 21) {
        win(streamerName, userName);
    }

    queue.shift();
}

function stand(streamerName, userName) {
    db = client.db(dbName);
    col = db.collection(streamerName);

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
}

function win(streamerName, userName) {
    db = client.db(dbName);
    col = db.collection(streamerName);

    let gamePot = getPot(streamerName);

    pot = nullCheck(pot, gamePot);
    
    insertUser(streamerName, userName);
    pot = 0;
    sHand = [getCard(), getCard()];
    initDealer();
    
    setStreamHand(streamerName, sHand);
    setDealerHand(streamerName, dHand);
    setPot(streamerName, pot);
}

function insertUser(streamerName, userName)
{
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
}

function pBust(streamerName) {
    sHand = nullCheck(sHand, playerHand);
    dHand = nullCheck(dHand, dealerHand);
    pot = nullCheck(pot, gamePot);

    insertUser(streamerName, streamerName);

    pot = 0;
    sHand = [getCard(), getCard()];
    initDealer();

    setPot(streamerName, pot);
    setStreamHand(streamerName, sHand);
    setDealerHand(streamerName, dHand);
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

function initDealer() {
    dHand = [getCard(), getCard()];
    if (handValue(dHand) == 21) {
        initDealer();
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
    setLeaderboard(streamerName, []);
    setStreamHand(streamerName, sHand);
    setDealerHand(streamerName, dHand);
    setQueue(streamerName, queue);
    setPot(streamerName, pot);

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

