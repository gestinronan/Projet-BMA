var mysql      = require('mysql');
var connection = mysql.createConnection('mysql://guillaume:guillaume@127.0.0.1:3306/test?debug=true');

// don't need .connect()
connection.query('CREATE TABLE TerStops (Stop_id int, Stop_name VARCHAR(100),' +
                 'Stop_lat VARCHAR(100),Stop_lon VARCHAR(100), PRIMARY KEY(Stop_id))',
function(err, result){
    // Case there is an error during the creation
    if(err) {
        console.log(err);
    } else {
        console.log("Table Ter_Stops Created");
    }
});