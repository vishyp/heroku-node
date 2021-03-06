var express = require('express');
var request = require('request');

var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json

// set the home page route
app.get('/', function(req, res) {

    // ejs render automatically looks in the views folder
    res.render('index');
});

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});


app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'my_dantes_hell_verify_me') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
})

app.post('/webhook/', function (req, res) {
console.log("printing req *****");
console.log(req.body);
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
  if (event.postback) {
    text = JSON.stringify(event.postback);
    sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token);
    continue;
  }
    if (event.message && event.message.text) {
      text = event.message.text;
	if (text === 'Generic') {
	    sendGenericMessage(sender);
	    continue;
  	}
        sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
    }
  }
  res.sendStatus(200);
});

var token = "EAABy6DGoqgIBALwhX54J96cjMiqBZAVJbhdYoj5BnPSvE3sfWtbzyPms6tlAhoypSQnSdc67fxYukjDrMRFXKQZCIs2AQOBha0GM6yLSvTug6RZALqCr0RatKCZBzgknwOh2n9I3u9ZAh8pyRgYoa9uOjythcUNPlFe0z6g4cxgZDZD";

function sendTextMessage(sender, text) {
 console.log("Sender: " + sender + " text = " + text);
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}



function sendGenericMessage(sender) {
  messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "First card",
          "subtitle": "Element #1 of an hscroll",
          // "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
          "buttons": [
	{
            "type": "postback",
            "title": "A. jon",
            "payload": "A",
        },
	{
            "type": "postback",
            "title": "B. Paul",
            "payload": "B",
        },
	{
            "type": "postback",
            "title": "C. George",
            "payload": "C",
        }
],
        }
/*,{
          "title": "Second card",
          "subtitle": "Element #2 of an hscroll",
          "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
          "buttons": [{
            "type": "postback",
            "title": "Postback",
            "payload": "Payload for second element in a generic bubble",
          }],
        } */
]
      }
    }
  };
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

