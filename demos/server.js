var express      = require('express');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var app          = express();

app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(function (req, res, next) {
    console.log("adding cookie");
    res.cookie('userid', 'myuseride');
    next();
});

app.post('/pubTest', function (req, res) {
    console.log("Received!");
    console.log(req.body);
    res.send('Received');
});

app.get("/set/cookie", function(req, res) {
    res.send("cookie set");
});


app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});
