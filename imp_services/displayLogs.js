var Q = require("q");

var LogTypeMap = {};
LogTypeMap[100] = {
    type: "Added Inventory",
    callFunction: function (LogType, logUsername,  time,  actionData) {
        return time + " - " + logUsername + ": " + "Added " + actionData.quantity + " units of product " + actionData.productId + " to location " + actionData.location;
    }
};
LogTypeMap[300] = {
    type: "Added Item to Cart",
    callFunction: function (LogType, logUsername,  time,  actionData) {
        return time + " - " + logUsername + ": " + "Added " + actionData.amount + " units of product " + actionData.productId + " to cart " + actionData.cartName;
    }
};
LogTypeMap[700] = {
    type: "Created Cart",
    callFunction: function (LogType, logUsername, time, actionData) {
        return time + " - " + logUsername + ": " + "Created new cart '" + actionData.cartName + "' assigned to " + actionData.assignee + ", will expire in " + actionData.daysToDelete + " days";
    }
};
LogTypeMap[800] = {
    type: "Created User",
    callFunction: function (LogType, logUsername, time, actionData) {
        return time + " - " + logUsername + ": " + "Created new user " + actionData.value;
    }
};
LogTypeMap[900] = {
    type: "Logged In User",
    callFunction: function (LogType, logUsername,  time,  actionData) {
        return time + " - " + logUsername + ": " + actionData.user + " logged in";
    }
};

function toStringDefault (LogType, logUsername,  time,  actionData) {
    return time + " - " + LogTypeMap[LogType].type;
}

function typeNotAddedYet (LogType, logUsername, time, actionData) {
    return time + " - " + logUsername + ": " + "log type '" + LogType + "' not added yet";
}

module.exports =
{
    _verifyKey: function (key) {
        return LogTypeMap[key] == undefined ? false : true;
    },

    displayLogs: function (cookie, callback) {
        var stringLogs = [];

        var db = require("../imp_services/impdb.js").connect();

        require("../imp_services/impredis.js").get(cookie, function usernameReturn(error, val)
        {
            var username = val.username;

            return Q.fcall(db.beginTransaction())
                .then(db.query("USE " + db.databaseName))
                .then(db.query("CALL GetLogsUserView(\'" + username+ "\');"))
                .then(function (rows) {

                    if (rows[0][0].length == 0) { // No user by that username
                        return "Invalid Result!";
                    }

                    for (var i = 0; i < rows[0][0].length; i++) {
                        var row = rows[0][0][i];
                        var logID = row.LogID;
                        var LogType = row.LogType;
                        var logUsername = row.Username;
                        var time = row.Time;
                        var actionData = row.ActionData;

                        if (LogTypeMap[LogType] == null) {
                            stringLogs.push(typeNotAddedYet(LogType, logUsername, time, JSON.parse(actionData)));
                        } else {
                            stringLogs.push(LogTypeMap[LogType].callFunction(LogType, logUsername, time, JSON.parse(actionData)));
                        }
                        console.log(stringLogs[i]);
                    }

                    var jsonObject = {logs:stringLogs};

                    callback(JSON.stringify(jsonObject));

                })
                .then(db.commit())
                .then(db.endTransaction())
                .catch(function (err) {
                    Q.fcall(db.rollback())
                        .then(db.endTransaction());
                    console.log("We had an error");
                    console.log("Error: " + err);
                })
                .done();
        })
    }
};
