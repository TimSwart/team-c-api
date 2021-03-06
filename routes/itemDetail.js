var express = require("express");
var router = express.Router();
var Q = require('q');


router.route("/:productID").get(function(req,res){
    Q.longStackSupport = true;
    var db = require("../imp_services/impdb.js").connect();
    Q.fcall(db.beginTransaction())
        .then(db.query("USE " + db.databaseName))
        .then(db.query(
            "SELECT Pr.ProductID, Pr.Name, IFNULL(SUM(R.QuantityAvailable), 0) AS TotalAvailable, IFNULL(SUM(R.QuantityReserved), 0) AS TotalReserved, IFNULL(MAX(R.DateCreated), 'n/a') AS MostRecent "
            + "FROM " + db.productTable + " AS Pr JOIN " + db.pileTable + " AS Pi ON Pr.ProductID = Pi.ProductID JOIN " + db.runTable + " AS R ON R.PileID = Pi.PileID "
            + "WHERE Pr.ProductID = " + req.params.productID))
        .then(function(rows){
            console.log("Success");
            var invUnit = JSON.stringify(rows[0]);
            res.send(invUnit);
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
