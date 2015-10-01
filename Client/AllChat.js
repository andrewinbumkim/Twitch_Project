var $ = function(query) {
    return document.querySelectorAll(query)
}

var bottomLock = true
var usernameColors = new Map();
var messageContainer = $("#message-container")[0]

messageContainer.addEventListener("wheel", function(){
    if (this.scrollHeight - this.scrollTop === window.innerHeight) {
        bottomLock = true
    } else {
        bottomLock = false
    }
})

messageContainer.addMessage = function(msgObj) {
  var messageObject = JSON.parse(msgObj)
  var entry = document.createElement("div")
  entry.classList.add("entry-element")
  var username = document.createElement("span")
  username.classList.add("username-element")
  username.textContent = messageObject.user
  var message = document.createElement("span")
  message.classList.add("message-element")
  message.textContent = ": " + messageObject.message
  entry.appendChild(username)
  entry.appendChild(message)
  messageContainer.appendChild(entry)  
  if (usernameColors.has(username.textContent)) {
      username.style.color = usernameColors.get(username.textContent)
  } else {
      usernameColors.set(username.textContent, randomColor())
      username.style.color = usernameColors.get(username.textContent)
  }
  if (bottomLock) {
    messageContainer.scrollTop = messageContainer.scrollHeight
  }
}

function randomColor() {
  var colors = ["008000", "DAA520", "FF0000", "00FF7F", "0000FF", "8A2BE2", "5F9EA0", "1E90FF", "9ACD32", "FF69B4", "D2691E", "FF7F50", "B22222"]
  return "#" + colors[Math.floor(Math.random()*colors.length)]
}

var ws = new WebSocket("ws://52.8.234.66:3434")
//var ws = new WebSocket("ws://52.8.54.187:3434")
ws.addEventListener("message", function(event) {messageContainer.addMessage(event.data)})