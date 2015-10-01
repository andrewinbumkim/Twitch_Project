"use strict"

class ChannelObject {

  constructor(name) {
    this.channelName = name
    this.subscribers = new Array()
  }

  addSubscriber(sub) {
    this.subscribers.push(sub)
  }  

  broadcastToSubscribers(message) {
    this.subscribers.forEach(function(appClient) {
      appClient.send(message)
    })
  }

}

class AppClient {

  constructor(webSocket) {
    this.ws = webSocket
    this.subscriptions = new Array()
  }

  subscribe(channelName) {
    subscriptions.push(channelName)
  }

  send(message) {
    try{
        this.ws.send(message)
    } catch (e) {}
  }
}

var irc = require('irc');
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 3434});
var allChannels = new Map();
var allAppClients = new Array();
var defaultChannels = ["#tsm_dyrus", "#voyboy"];

var twitchClient = new irc.Client('irc.twitch.tv', 'shinpiplup', {
  "showErrors" : true,
  "autoRejoin" : true,
  "channels" : defaultChannels,
  "password" : "oauth:vcna25phbdqya03v8om3f5evnglh5x"
})

var initializeDefaultChannel = function(channel){
  twitchClient.join(channel) 
  allChannels.set(channel.substring(1), new ChannelObject(channel.substring(1)))
}

defaultChannels.forEach(function(channel){
  initializeDefaultChannel(channel)
})


//twitchClient.join("#voyboy");

//allChannels.set("voyboy", new ChannelObject("voyboy"));


twitchClient.addListener("message", function(user, channel, message){

  console.log(channel, " ", user, " ", message);
  var msg = {"user":user, "channel":channel, "message":message}

  allChannels.get(channel.substring(1)).broadcastToSubscribers(JSON.stringify(msg));

})

wss.on("connection", function connection(ws){

  var theClient = new AppClient(ws);

  allAppClients.push(theClient); 

  ws.on("message", function(message) {

    //check if channel obj already exist

    //check if message is valid string

    if(allChannels.has(message)) {

      allChannels.get(message).addSubscriber(theClient);

    } else {

      var theChannel = new ChannelObject(message);

      allChannels.set(message, theChannel);

      twitchClient.join("#" + message);

      theChannel.addSubscriber(theClient);

    }

  });

});