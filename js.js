Parse.initialize("myAppID");
Parse.serverURL = 'https://parse-server-codecraft-example.herokuapp.com/parse';


var MESSAGES = [];
var ChatMessage = Parse.Object.extend("ChatMessage");
var QUERY = new Parse.Query("ChatMessage");

function renderMessages() {
    // This renders the full list of messages to the screen
    var $messagesEl = $("#messages");
    $messagesEl.empty();
    for( var i = 0; i < MESSAGES.length; i++ ) {
        var message = MESSAGES[i];
        var name = message.get("name");
        var content = message.get("content");
        var ts = message.get("createdAt");
        var hours = ts.getHours();
        var minutes = ts.getMinutes();
        var seconds = ts.getSeconds();
        var time = hours + ":" + minutes + ":" + seconds;
        var msgEl = "<li> <i>(" + time + ")</i> <b>" + content + "</b> - @" + name + "</li>";
        $messagesEl.append(msgEl);
    }
}

function loadMessages(data) {
    // Load all the old messages from parse, newest first
    QUERY.descending("createdAt");
    QUERY.find().then(function(results) {
        MESSAGES = results;
        renderMessages();
    });
}

function sendMessage(data) {
    // Save a chat message to parse and then render it on the screen
    var message = new ChatMessage();
    message.set("name", data.name);
    message.set("content", data.content);
    message.save().then(function(obj) {
        console.log("Message saved!");
        // addMessage(obj)
    }, function(err) {
        alert(err.message);
    });
}

function addMessage(message) {
    console.log("Adding chat message the front of the messsages list");
    MESSAGES.unshift(message);
    renderMessages();
}

function deleteMessage(message) {
    console.log("Removing message from the list");
    for( var i = MESSAGES.length; i >= 0; i-- ) {
        if (MESSAGES[i].id === messsage.id) {
            MESSAGES.splice(i, 1);
        }
        break;
    }
    renderMessages();
}

function subscribeMessages(message) {
    console.log("Subscribing to new messages from parse");

    var subscription = QUERY.subscribe();
    subscription.on("create", function(message) {
        console.log("Message created");
        addMessage(message);
    });

    subscription.on("leave", function(obj) {
        console.log("Message deleted");
        deleteMessage(message);
    });

}

function doPing() {
    Parse.Cloud.run("ping").then(function(responce) {
        if (responce === "pong") {
            alert("Server is running!");
        }
    });
}

$(document).ready(function() {

    // Load all the existing messages for this room
    loadMessages();

    // Listen for new messages
    subscribeMessages();

    // Handle when the user wants to send a message
    var chatForm = $("#chat-form");
    chatForm.submit(function(e) {

        e.preventDefault();
        var data = {};
        chatForm.serializeArray().map(function(x){data[x.name] = x.value;});
        sendMessage(data);
        $("#message").val("");
    });

    // Handle when the user wants to send a message
    $("#ping-btn").click(function(e) {
        e.preventDefault();
        doPing();
    });
});
