import * as express from "express";
import * as mongo from "mongodb";
import { resolve } from "path";
import { UserDTO, JsonResponse } from "./common";

const app = express();
const PORT = process.env.EXPRESS_PORT || 3000;

if (process.env.NODE_ENV === "development") {
  app.use(express.static(resolve(__dirname, "..", "dist-dev")));
  app.use(express.static(resolve(__dirname, "..")));
} else {

  //    app.use(express.static(resolve(__dirname,"..","dist")));
  app.use(express.static(resolve(__dirname, "..", "dist-dev")));
  app.use(express.static(resolve(__dirname, "..")));
}

var MongoClient = mongo.MongoClient;

MongoClient.connect("mongodb://localhost:27017/animals", function(err, db) {
  if (err) {
    throw err;
  }
  db.collection("mammals").find().toArray(function(err, result) {
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
  var response: JsonResponse = {
    status: "success",
    payload: "Hello from api"
  };
  res.json(response);
});

// Creates new business, admin and fidebox users, save info about business in database
app.post("/api/business/register", (req, res) => {
  // TODO Get chosen dev key
  // TODO Ask Wapi to create new auth record
  // TODO Create for auth record new user and business inside this user
  // TODO Ask Wapi to create another auth record with generated username and password
  // TODO Create user for fidebox sessions
  // TODO Save info about business and fidebox user in database

  var response: JsonResponse = {
    status: "success",
    payload: ""
  };
  res.json(response);
});

// Logs in user in Wapi and gets token for further requests
app.post("/api/business/login", (req, res) => {
  // TODO Get chosen dev key
  // TODO Ask Wapi to log in user and get token
  // TODO Save token and mark user authenticated
  var response: JsonResponse = {
    status: "success",
    payload: {}
  };
  res.json(response);
});

// Create new program in Wapi with partnership and rule
app.post("/api/program/create", (req, res) => {
  // TODO Get chosen dev key
  // TODO Ask Wapi to create new program with partnership, correct rule and custom field
  var response: JsonResponse = {
    status: "success",
    payload: {}
  };
  res.json(response);
});

// Create new program in Wapi with partnership and rule
app.post("/api/program/edit", (req, res) => {
  // TODO Get chosen dev key
  // TODO Ask Wapi to save existing program data
  var response: JsonResponse = {
    status: "success",
    payload: {}
  };
  res.json(response);
});

// Deletes existing program
app.post("/api/program/delete", (req, res) => {
  // TODO Get chosen dev key
  // TODO Ask Wapi to delete program
  var response: JsonResponse = {
    status: "success",
    payload: ""
  };
  res.json(response);
});

// Gets list of all business programs from Wapi
app.post("/api/program/list", (req, res) => {
  // TODO Get chosen dev key
  // TODO Ask Wapi for all business programs
  var response: JsonResponse = {
    status: "success",
    payload: []
  };
  res.json(response);
});

// Ask Wapi to create device and terminal for fidebox and save it to database
app.post("/api/fidebox/activate", (req, res) => {
  // TODO Get chosen dev key
  // TODO Ask Wapi to create device and terminal
  // TODO Save data about fidebox to database
  var response: JsonResponse = {
    status: "success",
    payload: ""
  };
  res.json(response);
});

// Check for existing fidebox login tokens (ask new from Wapi if necessary) and give it to fidebox
app.post("/api/fidebox/activate", (req, res) => {
  // TODO Get chosen dev key
  // TODO Check db for existing fidebox login token and ask Wapi for new one, if necessary
  var response: JsonResponse = {
    status: "success",
    payload: "Some token"
  };
  res.json(response);
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
