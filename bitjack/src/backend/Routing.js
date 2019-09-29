const backendModule = require("./AWSBackend");
var express = require("express");
var app = express();
var http = require("http");

app.get("/getPot/:streamerName", function (req, res) {
    backendModule.getPot(req.params["streamerName"]).then(result => {
        res.send(result);
    });
});

app.get("/getQueue/:streamerName", function (req, res) {
    backendModule.getQueue(req.params["streamerName"]).then(result => {
        res.send(result);
    });
});

app.get("/getStreamHand/:streamerName", function (req, res) {
    backendModule.getStreamHand(req.params["streamerName"]).then(result => {
        res.send(result);
    });
});

app.get("/getDealerHand/:streamerName", function (req, res) {
    backendModule.getDealerHand(req.params["streamerName"]).then(result => {
        res.send(result);
    });
});

app.get("/getLeaderboard/:streamerName", function (req, res) {
    backendModule.getLeaderboard(req.params["streamerName"]).then(result => {
        res.send(result);
    });
});

app.get("/hit/:streamerName/:userName/:amount", function (req, res) {
    backendModule.addToPot(req.params["streamerName"], req.params['amount'])
    res.send(
        backendModule.addToQueue(req.params['streamerName'], req.params['userName'], 'hit')
    );
});

app.get("/stand/:streamerName/:userName/:amount", function (req, res) {
    backendModule.addToPot(req.params["streamerName"], req.params['amount'])
    res.send(
        backendModule.addToQueue(req.params["streamerName"], req.params["userName"], 'stand')
    );
});

app.get("/initialize/:streamerName", function (req, res) {
    backendModule.initialize(req.params["streamerName"]);
    res.status(200).send("Ok");
});

http.createServer(app).listen(8081, function () {
    console.log("Express server listening on port 8081");
});
