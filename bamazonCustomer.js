
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
        chooseID();
    });
}

var chooseID = function() {
    inquirer.prompt({
        name: "orderID",
        message: "Please select the item you want to purchase by its ID:\n",
        type: "input",


    }).then(answer => {
        if (answer.orderID <= 10) {
            chooseQuantity();
                
        }else{
            console.log("Sorry wrong item ID entered, please instert the right ID number and check again");
            connection.end();
        }

    })
}

var chooseQuantity = function() {
    inquirer.prompt({
        name:"quantity",
        message:"Please select the amount you would like to order:\n",
        type:"input"

    }).then(answer => {
        connection.query("SELECT * FROM products WHERE stock_quantity", function (err, results) {
            if (err) throw err;
            for(let i = 0; i < results.length; i++) {
            if (answer.quantity > results[i].stock_quantity) {
                console.log("Unfortunately we couldn't fulfill your order at this item, please try to lower your quantity!");
            }
            else {
                console.log("Thank you for your purchase, your order was received!");
            }
        }
        });
    })
}



  //   connection.end();
