var allChannels = new Map()
//var wsURL = "ws://52.8.234.66:3434"
var wsURL = "ws://52.8.54.187:3434"

//var port = chrome.runtime.connect({"name":"test"})

var ws = new WebSocket(wsURL)
ws.addEventListener("message", function (message){
  var messageObject = JSON.parse(message.data)
  console.log("!" + messageObject)
  if (!allChannels.has(messageObject.channel)) {
  	allChannels.set(messageObject.channel, new Array())
  	//port.postMessage(message)
  } 
  allChannels.get(messageObject.channel).push(messageObject)
})

var wsListeners = {
  "message" : function(message){
    var messageObject = JSON.parse(message)
    if (!allChannels.has(messageObject.user)) {
      allChannels.set(messageObject.user, new Array()) 
    }
    allChannels.get(messageObject.user).push(messageObject)
  },
  "close" : function(){
    console.error("Websocket connection lost " + (new Date()).toValue())
    var ws = new WebSocket(wsURL)
    for (var prop in wsListeners) {
    	ws.addEventListener(prop, wsListeners[prop])
    }
  },
  "error" : function(e){
    console.error(e)
  }
}