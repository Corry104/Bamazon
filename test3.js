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
connection.connect(function (err) {
    console.log("Connected as id: " + connection.threadId);
    if (err) throw err;
    product();
});

function product() {
    console.log("\nWelcome to bamazon! Selecting all products for you: \n");
    connection.query("SELECT * FROM products ORDER BY product_name", function (err, results) {
        if (err) throw err;
        for(let i = 0; i < results.length; i++) {
            console.log("~~~~~~~~~~~~");
            console.log("ID: " + results[i].id + " Product: " + results[i].product_name + " " + "$"+results[i].price);
        }
        chooseID(results);
    });
}



function chooseID(results) {
    inquirer.prompt({
        name: "orderID",
        message: "Please select the item you want to purchase by its ID:\n",
        type: "input"

    }).then(answer => {
        console.log(answer);
        if (answer.orderID === results.id) {
            chooseQuantity();
                
        }else{
            console.log("Sorry wrong item ID entered!");
        }

    })
}

var chooseQuantity = function() {
    inquirer.prompt({
        name:"quantity",
        message:"Please select the amount you would like to order:\n",
        type:"input"

    }).then(answer => {
        if ("") {
            console.log("");
        }else {
            console.log("");
        }
    })
}



  //   connection.end();