var client = require("mongodb").MongoClient;

var url = "mongodb://localhost:27017/";

//Specify the Amazon DocumentDB cert
//var ca = [fs.readFileSync("rds-combined-ca-bundle.pem")];

var sHand = [getCard(), getCard()];
var dHand = [];
var pot = 0;
var queue = [];
var sName = '';

const dbName = "BitJack";
const sHandID = 1;
const dHandID = 2;
const potID = 3;
const queueID = 4;
const leaderboardID = 5;

setInterval(() => {
  if (sName.length > 0) {
    getQueue(sName).then(function (result) {
      let gameQueue = result[0]['queue'];
      queue = nullCheck(queue, gameQueue);

      if (queue.length > 0) {
        if (queue[0][1] == 'hit') {
          hit(sName, queue[0][0]);
        } else {
          stand(sName, queue[0][0]);
        }
      }
    }, function (err) { });
  }
}, 5000);

function exists(col, paramID, genericFunction) {
  let result = col.find({ id: paramID });

  result.toArray(function (err, result) {
    if (result.length > 0) {
      genericFunction(true);
    } else {
      genericFunction(false);
    }
  });
}

function getDocument(col, paramID, genericFunction) {
  let result = col.find({ id: paramID });

  result.toArray(function (err, result) {
    genericFunction(result);
  });
}

function getLeaderboard(streamerName) {
  sName = streamerName;
  return new Promise(function (resolve, reject) {
    client.connect(url, function (err, client) {
      db = client.db(dbName);
      col = db.collection(streamerName);

      let result = col.find({ id: leaderboardID });
      getDocument(col, leaderboardID, function (result) {
        client.close();
        if (result.length > 0) {
          resolve(result);
        } else {
          reject("No Results");
        }
        console.log(result);
      });
    });
  });
}

function setLeaderboard(streamerName, leaderboard) {
  sName = streamerName;
  client.connect(url, function (err, client) {
    db = client.db(dbName);
    col = db.collection(streamerName);

    exists(col, leaderboardID, function (booleanboy) {
      console.log(booleanboy);
      if (booleanboy) {
        col.updateOne(
          { id: leaderboardID },
          { $set: { Leaderboard: leaderboard } },
          function (err, result) {
            console.log(result);
          }
        );
      } else {
        col.insertOne({ Leaderboard: leaderboard, id: leaderboardID }, function (
          err,
          result
        ) {
          console.log(result);
        });
      }

      client.close();
      return "Ok";
    });
  });
}

function getStreamHand(streamerName) {
  sName = streamerName;
  return new Promise(function (resolve, reject) {
    client.connect(url, function (err, client) {
      db = client.db(dbName);
      col = db.collection(streamerName);

      let result = col.find({ id: sHandID });
      getDocument(col, sHandID, function (result) {
        client.close();
        if (result.length > 0) {
          resolve(result);
        } else {
          reject("No Results");
        }
        console.log(result);
      });
    });
  });
}

function setStreamHand(streamerName, streamHand) {
  sName = streamerName;
  client.connect(url, function (err, client) {
    db = client.db(dbName);
    col = db.collection(streamerName);
    exists(col, sHandID, function (booleanbud) {
      console.log(booleanbud);
      if (booleanbud) {
        col.updateOne(
          { id: sHandID },
          { $set: { streamHand: streamHand, id: sHandID } },
          function (err, result) {
            console.log(result);
          }
        );
      } else {
        col.insertOne({ streamHand: sHand, id: sHandID }, function (
          err,
          result
        ) {
          console.log(result);
        });
      }
      client.close();
      return "Ok";
    });
  });
}

function getDealerHand(streamerName) {
  sName = streamerName;
  return new Promise(function (resolve, reject) {
    client.connect(url, function (err, client) {
      db = client.db(dbName);
      col = db.collection(streamerName);

      let result = col.find({ id: dHandID });
      getDocument(col, dHandID, function (result) {
        client.close();
        if (result.length > 0) {
          resolve(result);
        } else {
          reject("No Results");
        }
        console.log(result);
      });
    });
  });
}

function setDealerHand(streamerName, dealerHand) {
  sName = streamerName;
  client.connect(url, function (err, client) {
    db = client.db(dbName);
    col = db.collection(streamerName);
    exists(col, dHandID, function (booleanboy) {
      console.log(booleanboy);
      if (booleanboy) {
        col.updateOne(
          { id: dHandID },
          { $set: { DealerHand: dealerHand, id: dHandID } },
          function (err, result) {
            //console.log(result);
          }
        );
      } else {
        col.insertOne({ DealerHand: dealerHand, id: dHandID }, function (
          err,
          result
        ) {
          //console.log(result);
        });
      }
      client.close();
      return "ok";
    });
  });
}

function getQueue(streamerName) {
  sName = streamerName;
  return new Promise(function (resolve, reject) {
    client.connect(url, function (err, client) {
      db = client.db(dbName);
      col = db.collection(streamerName);

      let result = col.find({ id: queueID });
      getDocument(col, queueID, function (result) {
        client.close();
        if (result.length > 0) {
          resolve(result);
        } else {
          reject("No Results");
        }
        console.log(result);
      });
    });
  });
}

function setQueue(streamerName, queue) {
  sName = streamerName;
  client.connect(url, function (err, client) {
    db = client.db(dbName);
    col = db.collection(streamerName);

    exists(col, queueID, function (booleanboy) {
      console.log(booleanboy);
      if (booleanboy) {
        col.updateOne({ id: queueID }, { $set: { queue: queue } }, function (
          err,
          result
        ) {
          console.log(err);
          console.log(result);
        });
      } else {
        col.insertOne({ queue: queue, id: queueID }, function (err, result) {
          //console.log(result);
        });
      }

      client.close();
      return "Ok";
    });
  });
}

function getPot(streamerName) {
  sName = streamerName;
  return new Promise(function (resolve, reject) {
    client.connect(url, function (err, client) {
      db = client.db(dbName);
      col = db.collection(streamerName);

      let result = col.find({ id: potID });
      getDocument(col, potID, function (result) {
        client.close();
        if (result.length > 0) {
          resolve(result);
        } else {
          reject("No Results");
        }
        console.log(result);
      });
    });
  });
}

function setPot(streamerName, pot) {
  sName = streamerName;
  client.connect(url, function (err, client) {
    db = client.db(dbName);
    col = db.collection(streamerName);

    exists(col, potID, function (booleanboy) {
      console.log(booleanboy);
      if (booleanboy) {
        col.updateOne({ id: potID }, { $set: { pot: pot, id: potID } }, function (
          err,
          result
        ) {
          //console.log(result);
        });
      } else {
        col.insertOne({ pot: pot, id: potID }, function (err, result) {
          //console.log(result);
        });
      }

      client.close();
      return "Ok";
    });
  });
}

// No need to open client below this point because we open it in our get and sets
function hit(streamerName, userName) {
  sName = streamerName;
  getStreamHand(streamerName).then(
    function (result) {
      let playerHand = result;
      playerHand = playerHand[0]["streamHand"];
      getQueue(streamerName).then(
        function (result) {
          let gameQueue = result;
          gameQueue = gameQueue[0]["queue"];
          sHand = nullCheck(sHand, playerHand);
          queue = nullCheck(queue, gameQueue);

          sHand.push(getCard());

          let sValue = handValue(sHand);
          if (sValue > 21) {
            pBust(streamerName);
          } else if (sValue == 21) {
            win(streamerName, userName);
          }

          queue.shift();
          setQueue(streamerName, queue);
          setStreamHand(streamerName, sHand);

          return "Ok";
        },
        function (err) {
          console.log(err);
        }
      );
    },
    function (err) {
      console.log(err);
    }
  );
}

// No need to open client below this point because we open it in our get and sets
function stand(streamerName, userName) {
  sName = streamerName;
  getStreamHand(streamerName).then(
    function (result) {
      let playerHand = result;
      playerHand = playerHand[0]["streamHand"];
      getDealerHand(streamerName).then(
        function (result) {
          let dealerHand = result;
          dealerHand = dealerHand[0]["DealerHand"];
          getQueue(streamerName).then(
            function (result) {
              let gameQueue = result;
              gameQueue = gameQueue[0]["queue"];
              sHand = nullCheck(sHand, playerHand);
              dHand = nullCheck(dHand, dealerHand);
              queue = nullCheck(queue, gameQueue);

              while (handValue(dHand) < 17) {
                dHand.push(getCard());
              }

              if (handValue(sHand) <= handValue(dHand)) {
                pBust(streamerName);
              } else {
                win(streamerName, userName);
              }

              queue.shift();
              setQueue(streamerName, queue);
              setStreamHand(streamerName, sHand);
              setDealerHand(streamerName, dHand);

              return "Ok";
            },
            function (err) {
              console.log(err);
            }
          );
        },
        function (err) {
          console.log(err);
        }
      );
    },
    function (err) {
      console.log(err);
    }
  );
}

function addToQueue(streamerName, userName, action) {
  sName = streamerName;
  getQueue(streamerName).then(
    function (result) {
      let gameQueue = result;
      gameQueue = gameQueue[0]["queue"];
      queue = nullCheck(queue, gameQueue);

      queue.push([userName, action]);

      setQueue(streamerName, queue);
      return "Ok";
    },
    function (err) {
      console.log(err);
    }
  );
}

// No need to open client below this point because we open it in our get and sets
function win(streamerName, userName) {
  sName = streamerName;
  getPot(streamerName).then(
    function (result) {
      let gamePot = result;
      gamePot = gamePot[0]["pot"];
      getLeaderboard(streamerName).then(function(result) {
        leaderboard = leaderboard[0]['Leaderboard'];
        pot = nullCheck(pot, gamePot);

        insertUser(streamerName, userName);
        pot = 0;
        sHand = [getCard(), getCard()];
        initDealer(streamerName);

        setStreamHand(streamerName, sHand);
        setDealerHand(streamerName, dHand);
        setPot(streamerName, pot);

        return "Ok";
      }, function(err) {
        console.log(err);
      })
    },
    function (err) {
      console.log(err);
    }
  );
}

// No need to open client below this point because we open it in our get and sets
function insertUser(streamerName, userName) {
  sName = streamerName;
  getLeaderboard(streamerName).then(
    function (result) {
      let leaderboard = result;
      leaderboard = leaderboard[0]["Leaderboard"];

      if (!leaderboard) {
        leaderboard = [streamerName, 0];
        leaderboard.push([username, pot]);
      } else {
        let index = -1;
        for (let i = 0; i < leaderboard.length; i++) {
          if (leaderboard[i][0] == userName) {
            index = i;
          }
        }

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

      return "Ok";
    },
    function (err) {
      console.log(err);
    }
  );
}

function pBust(streamerName) {
  sName = streamerName;
  pot = 0;
  sHand = [getCard(), getCard()];
  initDealer(streamerName);

  setPot(streamerName, pot);
  setStreamHand(streamerName, sHand);
  setDealerHand(streamerName, dHand);

  return "Ok";
}

function addToPot(streamerName, addition) {
  sName = streamerName;
  getPot(streamerName).then(
    function (result) {
      let gamePot = result;
      gamePot = gamePot[0]["pot"];
      pot = nullCheck(pot, gamePot);

      pot = Number(pot) + Number(addition);

      setPot(streamerName, pot);

      return "Ok";
    },
    function (err) {
      console.log(err);
    }
  );
}

function handValue(hand) {
  let sum = 0;
  let aces = 0;

  for (let i = 0; i < hand.length; i++) {
    let value = cardValue(hand[i]);
    if (value == 11) {
      aces = aces + 1;
    } else {
      sum = sum + value;
    }
  }

  sum = sum + aces - 1;
  if (sum < 11) {
    return sum + 11;
  } else {
    return sum + 1;
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
  sName = streamerName;
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
  sName = streamerName;
  initDealer(streamerName);
  setLeaderboard(streamerName, [[streamerName, 0]]);
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
exports.setPot = setPot;
exports.getPot = getPot;
exports.setQueue = setQueue;
exports.getQueue = getQueue;
exports.setDealerHand = setDealerHand;
exports.getDealerHand = getDealerHand;
exports.setStreamHand = setStreamHand;
exports.getStreamHand = getStreamHand;
exports.setLeaderboard = setLeaderboard;
exports.addToQueue = addToQueue;
exports.addToPot = addToPot;
