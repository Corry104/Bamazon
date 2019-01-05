
var inquirer = require("inquirer");
var mysql = require("mysql");
var chalk = require("chalk");



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
            console.log(chalk.green("ID: ") + results[i].id + chalk.blue(" Product: ") + results[i].product_name + chalk.magenta(" Available Stock: ") + results[i].stock_quantity + " " + chalk.yellow("$")+results[i].price);
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
            console.log(chalk.red("Sorry wrong item ID entered, please instert the right ID number and check again"));
            chooseID();
        }

    })
}

var chooseQuantity = function() {
    inquirer.prompt({
        name:"quantity",
        message:"Please select the amount you would like to order:\n",
        type:"input"

    }).then(answer => {
        connection.query("SELECT * FROM products", chooseQuantity.quantity, function (err, results) {
            if (err) throw err;
            if (answer.quantity > results[0].stock_quantity) {
                console.log(chalk.red("Unfortunately we couldn't fulfill your order at this item, please try to lower your quantity!"));
                chooseQuantity();
            }
            else {
                console.log(chalk.green("Thank you for your purchase, your order was received!"));

            }
        });
    })
}



  //   connection.end();
