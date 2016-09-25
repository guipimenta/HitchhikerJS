var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static('public'));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post('/pubTest', function (req, res) {
    console.log("Received!");
    console.log(req.body);
    res.send('Received');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
