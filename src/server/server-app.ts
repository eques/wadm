import * as express from "express";
import * as mongo from "mongodb";
import { resolve } from "path";
import { JsonResponse } from "./common";
var body_parser = require("body-parser");
var request = require('request');
const dev_key = "fidebox123456789012345";
var wtoken = "";

const app = express();
app.use(body_parser.urlencoded({extended : true}));
app.use(body_parser.json());

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
var assert = require('assert');
var ObjectId = mongo.ObjectID;
var mongo_uri = 'mongodb://localhost:27017/wadm';

var insertBusiness = function(walmoo_id, fidebox_username, fidebox_token, db, callback) {
  db.collection('business').insertOne( {
    "walmoo_id" : walmoo_id,
    "fidebox_username" : fidebox_username,
    "fidebox_token" : fidebox_token
  }, function(err, result) {
    assert.equal(err, null);
    callback();
  });
};

app.post("/some-api/test", (req, res) => {
  var response: JsonResponse = {
    status: 200,
    payload: "Hello from api"
  };
  res.json(response);
});

// Creates new business, admin and fidebox users, save info about business in database
// TODO "Rollback" transaction, if error code received, delete all data that was created before
app.post("/api/business/register", (req, res) => {
  var walmoo_id = "";
  var fidebox_username = "";
  var fidebox_token = "";
  var wapi_data = {
    devKey: dev_key,
    username: req.body.username,
    password: req.body.password
  };
  var options = {
    uri: "http://api2.walmoo.com/resources/wal-core/auths/register",
    method: "POST",
    json: wapi_data
  };
  // ---=== REGISTER AUTH
  request(options, function(err, httpResponse, body){
    if (httpResponse.statusCode === 200) {
      var options = {
        uri: "http://api2.walmoo.com/resources/wal-core/auths/login",
        method: "POST",
        json: wapi_data
      };
      // ---=== LOG IN AUTH
      request(options, function(err, httpResponse, body){
        if (httpResponse.statusCode === 200) {
          wtoken = body.authToken;
          var business_data = {
            id: body.id,
            user: {
              business: {
                regnr: "regnr_" + body.id,
                title: "title_" + body.id
              }
            },
            devKey: dev_key
          };
          var options = {
            uri: "http://api2.walmoo.com/resources/wal-core/auths?need=user,business" ,
            method: "POST",
            json: business_data,
            headers: {
              "wtoken": wtoken,
            },
          };
          // ---=== CREATE BUSINESS AND USER
          request(options, function(err, httpResponse, body){
            if (httpResponse.statusCode === 200) {
              walmoo_id = body.user.businessId;
              fidebox_username = "fidebox@" + walmoo_id + ".com";
              var fidebox_pass = new Date().getTime();
              var fidebox_data = {
                devKey: dev_key,
                username: fidebox_username,
                password: fidebox_pass
              };

              var options = {
                uri: "http://api2.walmoo.com/resources/wal-core/auths/register",
                method: "POST",
                json: fidebox_data
              };
              // ---=== CREATE FIDEBOX AUTH
              request(options, function(err, httpResponse, body){
                if (httpResponse.statusCode === 200) {
                  var options = {
                    uri: "http://api2.walmoo.com/resources/wal-core/auths/login",
                    method: "POST",
                    json: fidebox_data
                  };
                  // ---=== LOG IN AUTH
                  request(options, function(err, httpResponse, body){
                    if (httpResponse.statusCode === 200) {
                      fidebox_token = body.authToken;
                      MongoClient.connect(mongo_uri, function(err, db) {
                        assert.equal(null, err);
                        insertBusiness(walmoo_id, fidebox_username, fidebox_token, db, function() {
                          db.close();
                          console.log("Data saved to database");
                          var response: JsonResponse = {
                            status: 200,
                            payload: "OK"
                          };
                          res.json(response);
                        });
                      });
                    } else {
                      var response: JsonResponse = {
                        status: httpResponse.statusCode,
                        payload: body
                      };
                      res.json(response);
                    }
                  });
                } else {
                  var response: JsonResponse = {
                    status: httpResponse.statusCode,
                    payload: body
                  };
                  res.json(response);
                }
              });
            } else {
              var response: JsonResponse = {
                status: httpResponse.statusCode,
                payload: body
              };
              res.json(response);
            }
          });
        } else {
          var response: JsonResponse = {
            status: httpResponse.statusCode,
            payload: body
          };
          res.json(response);
        }
      });
    } else {
      var response: JsonResponse = {
        status: httpResponse.statusCode,
        payload: body
      };
      res.json(response);
    }
  });
});

// Logs in user in Wapi and gets token for further requests
app.post("/api/business/login", (req, res) => {
  // TODO Get chosen dev key
  // TODO Ask Wapi to log in user and get token
  // TODO Save token and mark user authenticated
  var response: JsonResponse = {
    status: 200,
    payload: {}
  };
  res.json(response);
});

// Create new program in Wapi with partnership and rule
app.post("/api/program/create", (req, res) => {
  // TODO Get chosen dev key
  // TODO Ask Wapi to create new program with partnership, correct rule and custom field
  var response: JsonResponse = {
    status: 200,
    payload: {}
  };
  res.json(response);
});

// Create new program in Wapi with partnership and rule
app.post("/api/program/edit", (req, res) => {
  // TODO Get chosen dev key
  // TODO Ask Wapi to save existing program data
  var response: JsonResponse = {
    status: 200,
    payload: {}
  };
  res.json(response);
});

// Deletes existing program
app.post("/api/program/delete", (req, res) => {
  // TODO Get chosen dev key
  // TODO Ask Wapi to delete program
  var response: JsonResponse = {
    status: 200,
    payload: ""
  };
  res.json(response);
});

// Gets list of all business programs from Wapi
app.post("/api/program/list", (req, res) => {
  // TODO Get chosen dev key
  // TODO Ask Wapi for all business programs
  var response: JsonResponse = {
    status: 200,
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
    status: 200,
    payload: ""
  };
  res.json(response);
});

// Check for existing fidebox login tokens (ask new from Wapi if necessary) and give it to fidebox
app.post("/api/fidebox/activate", (req, res) => {
  // TODO Get chosen dev key
  // TODO Check db for existing fidebox login token and ask Wapi for new one, if necessary
  var response: JsonResponse = {
    status: 200,
    payload: "Some token"
  };
  res.json(response);
});

app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT} @ ${process.env.NODE_ENV}`);
});
