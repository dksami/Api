const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const app = express();
const port = 3737;

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
    server: '192.168.0.49',
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
app.get("/insert/:transfer/:from/:to/:barcode/:date/:quantity/:name/:cost", function (req, res) {
var from =decodeURIComponent(req.params.from);
from = from.replace(new RegExp("\\+","g"),' ');
var to = decodeURIComponent(req.params.to);
to = to.replace(new RegExp("\\+","g"),' ');
var barcode = decodeURIComponent(req.params.barcode);
var date = decodeURIComponent(req.params.date);
var qty = decodeURIComponent(req.params.quantity);
var name = decodeURIComponent(req.params.name);
name = name.replace(new RegExp("\\+","g"),' ');

    var query = "INSERT INTO [CUBES_HO].[dbo].[TransferApp] ([transferid],[from],[to],[barcode],[date],[quantity],[pname],[pcost]) VALUES ('"+req.params.transfer+"','"+from+"','"+to+"','"+barcode+"','"+date+"','"+qty+"','"+name+"','"+req.params.cost+"')";

    executeQuery(query)
        .then((data) => {
            res.status(200).send({ "msg": "Records Inserted", "data": data.recordsets });
        }).catch((err) => {
            res.status(500).json({ "msg": err.message });
        });

});
//GET API
app.get("/purchase/:transfer/:from/:to/:barcode/:date/:quantity/:payment/:sup/:invo/:name/:cost", function (req, res) {
var from =decodeURIComponent(req.params.from);
from = from.replace(new RegExp("\\+","g"),' ');
var to = decodeURIComponent(req.params.to);
to = to.replace(new RegExp("\\+","g"),' ');
var too = decodeURIComponent(req.params.sup);
too = too.replace(new RegExp("\\+","g"),' ');
var name = decodeURIComponent(req.params.name);
name = name.replace(new RegExp("\\+","g"),' ');

var barcode = decodeURIComponent(req.params.barcode);
var date = decodeURIComponent(req.params.date);
var qty = decodeURIComponent(req.params.quantity);

    var query = "INSERT INTO [CUBES_HO].[dbo].[purchaseapp] ([purchaseid],[from],[to],[barcode],[date],[quantity],[payment],[sup],[inv],[pname],[pcost]) VALUES ('"+req.params.transfer+"','"+from+"','"+to+"','"+barcode+"','"+date+"','"+qty+"','"+req.params.payment+"','"+too+"','"+req.params.invo+"','"+name+"','"+req.params.cost+"')";

    executeQuery(query)
        .then((data) => {
            res.status(200).send({ "msg": "Records Inserted", "data": data.recordsets });
        }).catch((err) => {
            res.status(500).json({ "msg": err.message+query });
        });

});
//GET API
app.get("/return/:returns/:from/:to/:barcode/:date/:quantity/:invo/:name/:cost", function (req, res) {
var from =decodeURIComponent(req.params.from);
from = from.replace(new RegExp("\\+","g"),' ');
var to = decodeURIComponent(req.params.to);
to = to.replace(new RegExp("\\+","g"),' ');
var too = decodeURIComponent(req.params.sup);
too = too.replace(new RegExp("\\+","g"),' ');
var name = decodeURIComponent(req.params.name);
name = name.replace(new RegExp("\\+","g"),' ');
var barcode = decodeURIComponent(req.params.barcode);
var date = decodeURIComponent(req.params.date);
var qty = decodeURIComponent(req.params.quantity);

    var query = "INSERT INTO [CUBES_HO].[dbo].[returnapp] ([returnid],[from],[to],[barcode],[date],[qty],[inv],[pname],[pcost]) VALUES ('"+req.params.returns+"','"+from+"','"+to+"','"+barcode+"','"+date+"',"+qty+",'"+req.params.invo+"','"+name+"','"+req.params.cost+"')";

    executeQuery(query)
        .then((data) => {
            res.status(200).send({ "msg": "Records Inserted", "data": data.recordsets });
        }).catch((err) => {
            res.status(500).json({ "msg": err.message+query });
        });

});
//GET API
app.get("/stock/:id/:name/:barcode/:cost/:qty/:on/:date/:sub", function (req, res) {
var name =decodeURIComponent(req.params.name);
name = name.replace(new RegExp("\\+","g"),' ');
var to = decodeURIComponent(req.params.on);
to = to.replace(new RegExp("\\+","g"),' ');
var too = decodeURIComponent(req.params.sup);
too = too.replace(new RegExp("\\+","g"),' ');
var barcode = decodeURIComponent(req.params.barcode);
var date = decodeURIComponent(req.params.date);
var qty = decodeURIComponent(req.params.qty);

    var query = "insert into  [CUBES_HO].[dbo].[stocktake] ([uid],[name],[cost],[qty],[on],[date],[barcode],[submited]) values('"+req.params.id+"','"+name+"',"+req.params.cost+","+qty+",'"+to+"','"+date+"','"+barcode+"',"+req.params.sub+")";

    executeQuery(query)
        .then((data) => {
            res.status(200).send({ "msg": "Records Inserted", "data": data.recordsets });
        }).catch((err) => {
            res.status(500).json({ "msg": err.message+query });
        });

});

app.get("/getproduct/:barcode", function (req, res) {

    var query = "SELECT pro.prod_default_desc,pro.prd_cost,sup.customer_name FROM [CUBES_HO].[dbo].[mst_product] as pro inner join [CUBES_HO].[dbo].[mst_customer_supplier] as sup on  pro.supplier_1 = sup.cus_key where pro.prd_barcd = '"+req.params.barcode+"'";

    executeQuery(query)
        .then((data) => {
            res.status(200).send({ "msg": "Records Inserted", "data": data.recordsets });
        }).catch((err) => {
            res.status(500).json({ "msg": err.message });
        });

});
app.get("/transferapp/:tra", function (req, res) {

    var query = "SELECT *  FROM [CUBES_HO].[dbo].[TransferApp] where [transferid] = '"+req.params.tra+"'";

    executeQuery(query)
        .then((data) => {
            res.status(200).send({ "msg": "Records Inserted", "data": data.recordsets });
        }).catch((err) => {
            res.status(500).json({ "msg": err.message });
        });

});
app.get("/purapp/:tra", function (req, res) {

    var query = "SELECT *  FROM [CUBES_HO].[dbo].[purchaseapp] where [purchaseid] = '"+req.params.tra+"'";

    executeQuery(query)
        .then((data) => {
            res.status(200).send({ "msg": "Records Inserted", "data": data.recordsets });
        }).catch((err) => {
            res.status(500).json({ "msg": err.message });
        });

});
app.get("/retapp/:tra", function (req, res) {

    var query = "SELECT *  FROM [CUBES_HO].[dbo].[returnapp] where [returnid] = '"+req.params.tra+"'";

    executeQuery(query)
        .then((data) => {
            res.status(200).send({ "msg": "Records fetched", "data": data.recordsets });
        }).catch((err) => {
            res.status(500).json({ "msg": err.message });
        });

});
app.get("/retapp/:tra", function (req, res) {

    var query = "SELECT *  FROM [CUBES_HO].[dbo].[stocktake] where [uid] = '"+req.params.tra+"'";

    executeQuery(query)
        .then((data) => {
            res.status(200).send({ "msg": "Records fetched", "data": data.recordsets });
        }).catch((err) => {
            res.status(500).json({ "msg": err.message });
        });

});
app.get("/stocku/:tra/:sub", function (req, res) {

    var query = "update [CUBES_HO].[dbo].[stocktake] set submited = "+req.params.sub+" where uid = '"+req.params.tra+"'";

    executeQuery(query)
        .then((data) => {
            res.status(200).send({ "msg": "Records fetched", "data": data.recordsets });
        }).catch((err) => {
            res.status(500).json({ "msg": err.message });
        });

});


app.get("/updatepar/:payment/:qty/:inv/:id", function (req, res) {

    var query = "update [CUBES_HO].[dbo].[purchaseapp] set quantity = '"+req.params.qty+"' , inv = '"+req.params.inv+"' , payment = '"+req.params.payment+"' where id ="+req.params.id;

    executeQuery(query)
        .then((data) => {
            res.status(200).send({ "msg": "UPDATED", "data": data.recordsets });
        }).catch((err) => {
            res.status(500).json({ "msg": err.message });
        });

});


app.get("/deletepar/:id", function (req, res) {

    var query = "  delete from [CUBES_HO].[dbo].[purchaseapp] where id ="+req.params.id;

    executeQuery(query)
        .then((data) => {
            res.status(200).send({ "msg": "Deleted", "data": data.recordsets });
        }).catch((err) => {
            res.status(500).json({ "msg": err.message });
        });

});



//Setting up server
var server = app.listen(port || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});