/**
 * Created by johnschroeder on 7/14/15.
 */
var fs = require("fs");
var glob = require("glob");
var Q = require("q");

var reload = function() {
    var db = require("./imp_services/impdb").connect();
    var path = process.cwd()+'/config/StoredProcedures/';
    var grandQuery = "\n#Add 'USE imp_db_dev' or 'USE imp_db_prod' here\n\n";
    glob.sync('**/*.sql',{'cwd':path}).forEach(
        function(file){
            var query = fs.readFileSync(path + file);
            grandQuery += query + '\n\n';
        }
    );
    fs.writeFileSync("putMeInWorkbench.sql", grandQuery);
    console.log("First edit 'putMeInWorkbench.sql' (the top line only)");
    console.log("then point workbench to 'putMeInWorkbench.sql' and run it.")
};

reload();
