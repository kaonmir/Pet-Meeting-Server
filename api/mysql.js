const mysql = require("mysql");

class MySQL {
  static connection;

  static set(conn) {
    MySQL.connection = conn;
    MySQL.connection.connect();
    console.log("Connecting Successfully");
  }
  static get() {
    return MySQL.connection;
  }
  static createConnection(MySQLOption) {
    MySQL.set(mysql.createConnection(MySQLOption));
  }
}

module.exports = MySQL;
