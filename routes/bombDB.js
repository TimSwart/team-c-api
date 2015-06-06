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
router.route("/").get(function(req,res){
//    Q.longStackSupport = true;
    var db = require("../imp_services/impdb.js").connect();
    fs.readFile("config/resetDB.txt", function(err, data) {
        if(err) throw err;
        var array = data.toString().split(";");
        var queryArray = [];
        var j = 0;

        for(var i in array) {
            if(i < array.length - 1)
                queryArray[j++] = array[i];
        }
        db.query(queryArray)
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
});

module.exports = router;
