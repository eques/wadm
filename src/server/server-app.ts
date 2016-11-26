import * as express from "express";
import * as mongo from "mongodb";
import { resolve } from "path";
import { JsonResponse } from "./common";
var body_parser = require("body-parser");
var request = require('request');
const dev_key = "fidebox123456789012345";
var wtoken = "";
var walmoo_id;

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

var insertFidebox = function(walmoo_id, serial, db, callback) {
  db.collection('fidebox').insertOne( {
    "walmoo_id" : walmoo_id,
    "serial" : serial
  }, function(err, result) {
    assert.equal(err, null);
    callback();
  });
};

var findBusiness = function(walmoo_id, db, callback) {
  var cursor = db.collection('business').find( { "walmoo_id": walmoo_id } );
  var sent = false;
  cursor.each(function(err, doc) {
    assert.equal(err, null);
    if (doc != null && !sent) {
      callback(doc);
      sent = true;
    }
    if (!sent) {
      callback();
    }
  });
};

var findFidebox = function(serial, db, callback) {
  var cursor = db.collection('fidebox').find( { "serial": serial } );
  var sent = false;
  cursor.each(function(err, doc) {
    assert.equal(err, null);
    if (doc != null && !sent) {
      callback(doc);
      sent = true;
    }
    if (!sent) {
      callback();
    }
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
    if (httpResponse.statusCode !== 200) {
      var response: JsonResponse = {
        status: httpResponse.statusCode,
        payload: body || 'body undefined'
      };
      res.json(response);
      return;
    }
    var options = {
      uri: "http://api2.walmoo.com/resources/wal-core/auths/login",
      method: "POST",
      json: wapi_data
    };
    // ---=== LOG IN AUTH
    request(options, function(err, httpResponse, body){
      if (httpResponse.statusCode !== 200) {
        var response: JsonResponse = {
          status: httpResponse.statusCode,
          payload: body || 'body undefined'
        };
        res.json(response);
        return;
      }
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
        if (httpResponse.statusCode !== 200) {
          var response: JsonResponse = {
            status: httpResponse.statusCode,
            payload: body || 'body undefined'
          };
          res.json(response);
          return;
        }
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
          if (httpResponse.statusCode !== 200) {
            var response: JsonResponse = {
              status: httpResponse.statusCode,
              payload: body || 'body undefined'
            };
            res.json(response);
            return;
          }
          var options = {
            uri: "http://api2.walmoo.com/resources/wal-core/auths/login",
            method: "POST",
            json: fidebox_data
          };
          // ---=== LOG IN AUTH
          request(options, function(err, httpResponse, body){
            if (httpResponse.statusCode !== 200) {
              var response: JsonResponse = {
                status: httpResponse.statusCode,
                payload: body || 'body undefined'
              };
              res.json(response);
              return;
            }
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
          });
        });
      });
    });
  });
});

// Logs in user in Wapi and gets token for further requests
app.post("/api/business/login", (req, res) => {
  var wapi_data = {
    devKey: dev_key,
    username: req.body.username,
    password: req.body.password
  };
  var options = {
    uri: "http://api2.walmoo.com/resources/wal-core/auths/login?need=user",
    method: "POST",
    json: wapi_data
  };
  // ---=== LOG IN AUTH
  request(options, function(err, httpResponse, body){
    if (httpResponse.statusCode !== 200) {
      var response: JsonResponse = {
        status: httpResponse.statusCode,
        payload: body || 'body undefined'
      };
      res.json(response);
      return;
    }
    wtoken = body.authToken;
    walmoo_id = body.user.businessId;
    var response: JsonResponse = {
      status: 200,
      payload: "OK"
    };
    res.json(response);
  });
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
  var serial = req.body.serial;
  var td_data = {
    current: true,
    terminal: {
      name: "fidebox_" + serial,
      shop: {
        business: {
          id: walmoo_id
        }
      }
    },
    device:{
      imei: serial,
      business: {
        id: walmoo_id
      }
    }
  };

  var options = {
    uri: "http://api2.walmoo.com/resources/wal-core/terminal-devices",
    method: "POST",
    json: td_data,
    headers: {
      "wtoken": wtoken,
    },
  };

  // ---=== CREATE TERMINAL-DEVICE LINK
  request(options, function(err, httpResponse, body){
    console.log(body);
    if (httpResponse.statusCode === 200) {
      MongoClient.connect(mongo_uri, function(err, db) {
        assert.equal(null, err);
        insertFidebox(walmoo_id, serial, db, function() {
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
});

// Check for existing fidebox login tokens (ask new from Wapi if necessary) and give it to fidebox
app.post("/api/fidebox/login", (req, res) => {
  var serial = req.body.serial;
  MongoClient.connect(mongo_uri, function(err, db) {
    assert.equal(null, err);
    findFidebox(serial, db, function(doc) {
      db.close();
      if (typeof(doc) !== 'undefined') {
        MongoClient.connect(mongo_uri, function(err, db) {
          assert.equal(null, err);
          findBusiness(doc.walmoo_id, db, function(doc) {
            db.close();
            if (typeof(doc) !== 'undefined') {
              var response: JsonResponse = {
                status: 200,
                payload: doc.fidebox_token
              };
              res.json(response);
            } else {
              var response: JsonResponse = {
                status: 404,
                payload: "Business not found."
              };
              res.json(response);
            }
          });
        });
      } else {
        var response: JsonResponse = {
          status: 404,
          payload: "Device not found."
        };
        res.json(response);
      }
    });
  });
});

app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT} @ ${process.env.NODE_ENV}`);
});
