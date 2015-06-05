var express = require("express");
var router = express.Router();
var fs = require('fs');
var Q = require('q');

  /** BEFORE CHANGING ANYTHING HERE, MAKE SURE YOU UNDERSTAND THE RAMIFICATIONS!
 * THIS ROUTE DROPS THE SHARED DATABASE AND REPLACES IT WITH WHATEVER THE
 * SQL SCRIPT TELLS IT TO
  */
  var dbChanger;
  //Enter query into this array:
  fs.readFile("../config/resetDb.txt", function(err, data) {
      if(err) throw err;
      var array = data.toString().split(";\n");
      for(var i in array) {
          console.log(array[i]);
      }
  });
    dbChanger = data;
    console.log(dbChanger);
router.route("/").get(function(req,res){
//    Q.longStackSupport = true;
    var db = require("../imp_services/impdb.js").connect();
    Q.fcall(db.beginTransaction())
        .then(db.query(dbChanger))
        .then(function(rows, columns){
            console.log("Success");
            var invUnit = JSON.stringify(rows[0]);
            res.send(invUnit);
            db.endTransaction();
        })
        .then(db.commit())
        .then(db.endTransaction())
        .catch(function(err){
            Q.fcall(db.rollback())
                .then(db.endTransaction());
            console.log("Error:");
            console.error(err.stack);
            res.status(503).send("ERROR: " + err.code);
        })
        .done();
});

module.exports = router;
