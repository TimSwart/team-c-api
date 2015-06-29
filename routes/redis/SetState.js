/**
 * Created by Kun on 6/28/2015.
 */

//http://www.sitepoint.com/using-redis-node-js/


var express = require("express");
var Q = require('q');
var router = express.Router();
var redis = require('redis');
var client = redis.createClient();//needs real host and port


router.route('/:cookie/:username/:page').get(function(req, res) {
    client.hmset(req.params.cookie,"Username",req.params.username,"Page" ,reg.params.page,function (error, result) {
        if (error !== null) {
            console.log("error: " + error);
            res.send("error: " + error);
        }
        else {
            console.log(res);
            res.send(res);
        }
    });
});

module.exports = router;