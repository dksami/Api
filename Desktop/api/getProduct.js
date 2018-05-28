const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const app = express();
const port = 3535;

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
    server: '94.200.123.222',
    database: 'CUBES_HO',
};

function executeQuery(query) {
    return new Promise((resolve, reject) => {
        sql.connect(dbConfig, function (err) {
            if (err) {
                reject(err);
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
app.get("/product/:barcode", function (req, res) {
    var query = "SELECT prod_default_desc  FROM [CUBES_HO].[dbo].[mst_product]  where prd_barcd = '"+req.params.barcode+"'";
    executeQuery(query)
        .then((data) => {
            res.status(200).send({ "msg": "Records fetched", "data": data.recordsets });
        }).catch((err) => {
            res.status(500).json({ "msg": err.message });
        });
});
//GET Location
app.get("/location", function (req, res) {
    var query = "SELECT inv_loc_name,inv_loc_key FROM [CUBES_HO].[dbo].[mst_inv_location]";
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