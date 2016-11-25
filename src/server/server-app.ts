import * as express from "express";
import * as mongo from "mongodb";
import { resolve } from "path";
import { UserDTO } from "./common";

const app = express();
const PORT = process.env.EXPRESS_PORT || 3000;

if (process.env.NODE_ENV === "development") {
  app.use(express.static(resolve(__dirname, '..', 'dist-dev')));
  app.use(express.static(resolve(__dirname, '..')));
} else {

  //    app.use(express.static(resolve(__dirname,'..','dist')));
  app.use(express.static(resolve(__dirname, '..', 'dist-dev')));
  app.use(express.static(resolve(__dirname, '..')));
}

var MongoClient = mongo.MongoClient;

MongoClient.connect('mongodb://localhost:27017/animals', function(err, db) {
  if (err) {
    throw err;
  }
  db.collection('mammals').find().toArray(function(err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
  });
});

var users = Object.create(null) as {
  [id: string]: UserDTO
};

var usersByEmail = Object.create(null) as {
  [email: string]: UserDTO
};

var fs = require("fs");

var running = false;
var once_more = false;
function dump() {
  if (running) {
    once_more = true;
  } else {
    running = true;
    fs.writeFile("/tmp/myapp.json", JSON.stringify({
      users
    }), () => {
      running = false;
      if (once_more) {
        once_more = false;
        dump();
      }
    });
  }
}

app.get("/dump", (req, res) => {
  dump();
  res.json({users});
});

var jsonParser = require("body-parser").json();

function has(x, y) {
  return Object.hasOwnProperty.call(x, y);
}

app.post("/some-api/test", (req, res) => {
  res.json({hello: "api"});
});

fs.readFile("/tmp/myapp.json", "utf8", (e, data) => {
  if (!e) {
    console.log("RESTORE DATA");
    var data = JSON.parse(data);
    users = data.users as {[id: string]: UserDTO};
    Object.keys(users).forEach(id => {
      var user = users[id];
      usersByEmail[user.primary_email] = user;
    });
  } else {
    console.log(e);
  }
});

app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT} @ ${process.env.NODE_ENV}`);
});
