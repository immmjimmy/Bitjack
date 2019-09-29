const tmi = require("tmi.js");
const axios = require("axios");

// Define configuration options
const opts = {
  identity: {
    username: "immmjimmy",
    password: "oauth:6iqfy46s5rpkyqi6qb5xzwglodd1x5"
  },
  channels: ["gamesdonequick"]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) {
    return;
  } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandNames = msg.trim().split(" ");

  // If the command is known, let's execute it
  if (commandNames[0] === "twitchcondev3") {
    axios.get("http://localhost:8081/initialize/gamesdonequick").then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
