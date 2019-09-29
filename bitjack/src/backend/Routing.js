const backendModule = require('./AWSBackend');
var express = require('express');
var app =  express();
var http = require('http');


app.get('/getPot/:streamerName', function(req, res) {
    res.send(backendModule.getPot(req.params['streamerName']))
})

app.get('/getQueue/:streamerName', function(req, res) {
    res.send(backendModule.getQueue(req.params['streamerName']))
})

app.get('/getStreamHand/:streamerName', function(req, res) {
    res.send(backendModule.getStreamHand(req.params['streamerName']))
})

app.get('/getDealerHand/:streamerName', function(req, res) {
    res.send(backendModule.getDealerHand(req.params['streamerName']))
})

app.get('/getLeaderboard/:streamerName', function(req, res) {
    res.send(backendModule.getLeaderboard(req.params['streamerName']))
})

app.get('/initialize/:streamerName', function(req, res) {
    backendModule.initialize(req.params['streamerName']);
    res.status(200).send('Ok');
})

http.createServer(app).listen(8081, function() {
    console.log('Express server listening on port 8081');
})