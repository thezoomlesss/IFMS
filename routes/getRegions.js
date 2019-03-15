var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var conn_detail = require(".././conn.json")

var connection = mysql.createConnection({
    // properties
    'host': conn_detail.host,
    'user': conn_detail.user,
    'password': conn_detail.password,
    'database': conn_detail.database,
    'connectionLimit': 100,
    'port': 3306,
    'debug': false,
    'multipleStatements': true
});


connection.connect(function (error) {
    // callback
    if (!!error) {
        console.log('Error when connecting from getRegions.js');

        console.log(error);
    } else {
        console.log('Db connected from getRegions.js!');
    }
});

router.get('/', function (req, res, next) {
    
    // parameters being passed in
    var company_id = req.query.cid;

    let sql_getRegion = `
        Select r.regionID, r.region_name FROM Region r
        JOIN Company c USING(companyID)
        WHERE c.companyID = ?;`;

    let data = [company_id];
    
    if(company_id){
        connection.query(sql_getRegion, data, function (error, results, fields) {

            if (error) {
                res.status(422).send('Error when adding a new region');
                throw error;
            }
            if (results.length > 0) {
                if (results) {
                    // Passing the name of the company and the status
                    // var detailResults = JSON.parse(JSON.stringify(results[0]));
                    res.json(results);
                }
            } else {
                res.status(204).send("No match");
            }
        });
    }else{
        res.status(400).send("No parameters passed");
    }
});

module.exports = router;