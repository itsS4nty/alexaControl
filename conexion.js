const sql = require("mssql");
const fs = require("fs");
const dataSecret = fs.readFileSync('data.json');
var content = JSON.parse(dataSecret);


async function recHit(database, consultaSQL) {
    var config =
    {
        user: content.user,
        password: content.password,
        server: content.server,
        database: database
    };
    var devolver = new Promise((dev, rej) => {
        new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request().query(consultaSQL);
        }).then(result => {
            dev(result);
            sql.close();
        }).catch(err => {
            console.log(err);
//            console.log("SQL: ", consultaSQL)
            sql.close();
        });
    });
    return devolver;
}

module.exports.recHit = recHit;
