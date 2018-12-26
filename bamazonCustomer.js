var inquirer = require("inquirer");
var mysql = require("mysql");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "",
    database: "bamazonDB"
  });

  // connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // // run the start function after the connection is made to prompt the user
   readProducts();
  });

  function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(res);
    //   connection.end();
    });
  }

//   function start() {
//     inquirer
//       .prompt({
//         name: "OnlineOrder",
//         type: "rawlist",
//         message: "Would you like to [POST] an auction or [BID] on an auction?",
//         choices: ["POST", "BID"]
//       })
//       .then(function(answer) {
//         // based on their answer, either call the bid or the post functions
//         if (answer.postOrBid.toUpperCase() === "POST") {
//           postAuction();
//         }
//         else {
//           bidAuction();
//         }
//       });
//   }