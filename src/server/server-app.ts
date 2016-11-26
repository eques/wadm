import * as express from "express";
import * as mongo from "mongodb";
import { resolve } from "path";
import { JsonResponse } from "./common";
var body_parser = require("body-parser");
var request = require('request');
const dev_key = "fidebox123456789012345";
var wtoken = "";
var walmoo_id;
var current_business;

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

var insertBusiness = function(business_data, db, callback) {
  db.collection('business').insertOne( {
    "walmoo_id" : business_data.walmoo_id,
    "fidebox_username" : business_data.fidebox_username,
    "fidebox_token" : business_data.fidebox_token,
    "default_prog_id": business_data.default_prog_id,
    "after_rule_id": business_data.after_rule_id
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
      res.status(httpResponse.statusCode).send(body);
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
        res.status(httpResponse.statusCode).send(body);
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
          res.status(httpResponse.statusCode).send(body);
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
            res.status(httpResponse.statusCode).send(body);
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
              res.status(httpResponse.statusCode).send(body);
              return;
            }
            fidebox_token = body.authToken;
            var user_data = {
              id: body.id,
              user: {
                business: {
                  id: walmoo_id
                }
              },
              devKey: dev_key
            };
            var options = {
              uri: "http://api2.walmoo.com/resources/wal-core/auths?need=user,business" ,
              method: "POST",
              json: user_data,
              headers: {
                "wtoken": fidebox_token,
              },
            };
            // ---=== USER FOR FIDEBOX
            request(options, function(err, httpResponse, body) {
              if (httpResponse.statusCode !== 200) {
                res.status(httpResponse.statusCode).send(body);
                return;
              }

              let wapi_prog = {
                active: true,
                auto: true,
                priority: 1,
                unit: "ENROLMENT",
                type: "PROG",
                open: false,
                name: {
                  lv: "default",
                  ru: "default",
                  en: "default"
                },
                afterRule: {
                  name: "default prog rule",
                  unit: "ACTIVITY",
                  choices: 1
                },
                partnerships: [
                  {admin: true,
                    referenceId: walmoo_id
                  }]
              };

              let options = {
                uri: "http://api2.walmoo.com/resources/wal-program/programs" ,
                method: "POST",
                json: wapi_prog,
                headers: {
                  "wtoken": wtoken,
                },
              };
              // ---=== CREATE DEFAULT VISITS COUNTER
              request(options, function(err, httpResponse, body){
                if (httpResponse.statusCode !== 200) {
                  res.status(httpResponse.statusCode).send(body);
                  return;
                }
                let default_prog_id = body.id;
                let after_rule_id = body.afterRuleId;
                MongoClient.connect(mongo_uri, function(err, db) {
                  assert.equal(null, err);
                  let business_data = {
                    walmoo_id: walmoo_id,
                    fidebox_username: fidebox_username,
                    fidebox_token: fidebox_token,
                    default_prog_id: default_prog_id,
                    after_rule_id: after_rule_id
                  };
                  current_business = business_data;
                  insertBusiness(business_data, db, function() {
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
      res.status(httpResponse.statusCode).send(body);
      return;
    }
    wtoken = body.authToken;
    walmoo_id = body.user.businessId;
    MongoClient.connect(mongo_uri, function(err, db) {
      assert.equal(null, err);
      findBusiness(walmoo_id, db, function(doc) {
        db.close();
        if (typeof(doc) !== 'undefined') {
          current_business = doc;
          var response: JsonResponse = {
            status: 200,
            payload: "OK"
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
  });
});

// Create new program in Wapi with partnership and rule
app.post("/api/program/save", (req, res) => {
  let program = {
    ruleId: req.body.ruleId || "",
    programId: req.body.programId || "",
    name: req.body.name,
    discount: req.body.discount,
    target: req.body.target,
    posNr: req.body.posNr
  };

  MongoClient.connect(mongo_uri, function(err, db) {
    assert.equal(null, err);
    findBusiness(walmoo_id, db, function(doc) {
      db.close();
      if (typeof(doc) !== 'undefined') {
        current_business = doc;
        let program_data = {
          name: program.name,
          priority: 0,
          unit: "ACTIVITY",
          amount: program.target,
          totals: true,
          ruleId: current_business.after_rule_id,
          program: {
            customFields: [
              {cfKey: "posNr", cfValue: program.posNr },
              {cfKey: "discount", cfValue: program.discount }
            ],
            active: true,
            type: "STATUS",
            name: {
              lv: program.name,
              ru: program.name,
              en: program.name
            },
            partnerships: [{admin: true, referenceId: walmoo_id}]
          }
        };

        if (program.ruleId !== "" && program.programId !== "") {
          program_data["id"] = program.ruleId;
          program_data.program["id"] = program.programId;
        }

        var options = {
          uri: "http://api2.walmoo.com/resources/wal-program/rules?need=program,customFields,name",
          method: "POST",
          json: program_data,
          headers: {
            "wtoken": wtoken,
          },
        };

        // ---=== SAVE PROGRAM
        request(options, function(err, httpResponse, body){
          if (httpResponse.statusCode !== 200) {
            res.status(httpResponse.statusCode).send(body);
            return;
          }

          let data = {
            ruleId: body.id,
            programId: body.program.id,
            name: body.program.name.lv,
            target: body.amount
          };
          for (let cf of body.program.customFields) {
            if (cf.cfKey === "discount") {
              data["discount"] = cf.cfValue;
            }
            if (cf.cfKey === "posNr") {
              data["posNr"] = cf.cfValue;
            }
          }
          var response: JsonResponse = {
            status: 200,
            payload: data
          };
          res.json(response);
        });
      } else {
        var response: JsonResponse = {
          status: 404,
          payload: "Business not found."
        };
        res.json(response);
      }
    });
  });
});

// Deletes existing program
app.post("/api/program/delete", (req, res) => {

    var options = {
      uri: "http://api2.walmoo.com/resources/wal-program/rules/" + req.body.ruleId,
      method: "DELETE",
      headers: {
        "wtoken": wtoken,
      },
    };
  // ---=== DELETE PROGRAM
  request(options, function(err, httpResponse, body){
    if (httpResponse.statusCode !== 200) {
      res.status(httpResponse.statusCode).send(body);
      return;
    }

    var response: JsonResponse = {
      status: 200,
      payload: "OK"
    };
    res.json(response);
  });
});

// Gets list of all business programs from Wapi
app.get("/api/program/list", (req, res) => {
  var options = {
    uri: "http://api2.walmoo.com/resources/wal-program/rules?need=program,customFields,name",
    method: "GET",
    headers: {
      "wtoken": wtoken,
    },
  };

  // ---=== GET LIST OF ALL PROGRAMS
  request(options, function(err, httpResponse, body){
    if (httpResponse.statusCode !== 200) {
      res.status(httpResponse.statusCode).send(body);
      return;
    }
    let all_progs = JSON.parse(body);
    let status_list = [];
    for (let prog of all_progs) {
      if (prog.hasOwnProperty(("program"))
          && prog.program !== null
          && prog.program.hasOwnProperty("type")
          && prog.program.type === "STATUS") {
        let data = {
          ruleId: prog.id,
          programId: prog.program.id,
          name: prog.program.name.lv,
          target: prog.amount
        };
        for (let cf of prog.program.customFields) {
          if (cf.cfKey === "discount") {
            data["discount"] = cf.cfValue;
          }
          if (cf.cfKey === "posNr") {
            data["posNr"] = cf.cfValue;
          }
        }
        status_list.push(data);
      }
    }

    var response: JsonResponse = {
      status: 200,
      payload: status_list
    };
    res.json(response);
  });
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
    if (httpResponse.statusCode !== 200) {
      res.status(httpResponse.statusCode).send(body);
      return;
    }
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
