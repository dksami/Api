const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const app = express();
const port = 3333;

// Body Parser Middleware
app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});
  // 

//Initiallising connection string
var dbConfig = {
    user: 'sa',
    password: "pdt0913",
    server: '94.206.28.46',
 
   database: 'CUBES',
};

function executeQuery(query) {
    return new Promise((resolve, reject) => {
        sql.connect(dbConfig, function (err) {
            if (err) {
                reject("Problem withconection"+err);
                sql.close();
            } else {
                // create Request object
                var request = new sql.Request();
                // query to the database and get the records
                request.query(query, function (err, data) {
                    if (err) {
                        reject(err);
                        sql.close();
                    } else {
                        resolve(data);
                        sql.close();
                    }
                });
            }
        });
    });
}

//GET API
app.get("/dailysale/:date", function (req, res) {
    var query = "SELECT SUM(bill_amt) AS totalSale FROM [CUBES].[dbo].[vw_bill_summary] where bill_sale_date =  '"+req.params.date+"'";
    executeQuery(query)
        .then((data) => {
            res.status(200).send({ "msg": "Records fetched", "data": data.recordsets });
        }).catch((err) => {
            res.status(500).json({ "msg": err.message });
        });
});


//Setting up server
var server = app.listen(port || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});