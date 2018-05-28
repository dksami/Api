var sql = require("mssql");
var connect = function()
{
    var conn = new sql.ConnectionPool({
        user: 'sa',
        password: 'pdt0913',
        server: '94.200.123.222,1433',
        database: 'CUBES_HO'
    });
 
    return conn;
};

module.exports = connect;