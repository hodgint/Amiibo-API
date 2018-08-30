const express = require('express');
const bodyParser = require('body-parser');

const app = express();

var port = process.env.PORT || 8080;

app.listen(port, function(){
  console.log("== Server running on port", port);
});
