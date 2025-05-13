//dbSingleton.js for the server
const mysql = require("mysql2");

let connection;
const dbSingleton = {
  getConnection: () => {
    if (!connection) {
      connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        //the databse we are currently working on it needs to be created from the user_db.sql script
        database: "user_db",
      });
      //general error handling
      connection.connect((err) => {
        if (err) {
          console.error("Error connecting to database:", err);
          throw err;
        }
        console.log("Connected to MySQL!");
      });

      connection.on("error", (err) => {
        console.error("Database connection error:", err);
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
          connection = null;
        }
      });
    }
    return connection;
  },
};
module.exports = dbSingleton;
