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
    showProducts();    
});

//show all products available
function showProducts() {
    console.log("\nWelcome to bamazon! Selecting all products for you: \n");
    //creating the connection to the database
    connection.query("SELECT * FROM products ORDER BY product_name", function (err, results) {
        if (err) throw err;
        console.log("~~~~~~~~~~~~Below is our product list~~~~~~~~~~~~~~~~");
        for(var i = 0; i < results.length; i++) {
            console.log(chalk.green("ID: " + results[i].id) + chalk.blue(" - Product: " + results[i].product_name)  + " " + chalk.yellow(" - $" + results[i].price) + chalk.magenta(" - Available in Stock: " + results[i].stock_quantity));
        }
        console.log("~~~~~~~~~~~~~~end of our product list~~~~~~~~~~~~~~");
        //call the function to ask the user for the product ID and brings the results
        //to avoid multiple connections
        chooseID(results);
    });
    
}
   
//user chooses the id   
function chooseID(results) {
    
    inquirer.prompt({
        name: "orderID",
        message: "Please select the item you want to purchase by its ID:\n",
        type: "input",

    }).then(answer => {
        //call the function to check the user's answer with the table's id
        compareId(answer.orderID, results);

    })
}

//checks if the inserted id exists
function compareId(insertedId, results) {
    //set the variable to false
    var exist = false;
    //loop through the results
    for(var c = 0; c < results.length; c++) {
        //matching the id with the database's table and break once it does
        if(insertedId == results[c].id){
            exist = true;
            var quantityOfProduct = results[c].stock_quantity;
			var price = results[c].price;
            break;
        }
    }
    if(exist){
        chooseQuantity(quantityOfProduct, insertedId, price);
        
    }else{
        console.log(chalk.red("This product does not exist, please choose another one."));
		chooseID(results);
    }
}


// user inserts the quantity
function chooseQuantity(quantityOfProduct, insertedId, price) {
    inquirer.prompt({
        name:"quantity",
        message:"Please select the amount you would like to order:\n",
        type:"input"

    }).then(answer2 => {
		//if the quantity request is available run this function and call the update function
		if(answer2.quantity <= quantityOfProduct){
			var tot = answer2.quantity * price;
            console.log(chalk.green("Thank you for your purchase, your order was received and the total amount is $ " + tot));
            updateDB(insertedId, answer2.quantity);
        }
        else{
            console.log(chalk.red("Unfortunately we don't have enough items available to fulfill your order, please try to lower your quantity!"));
			chooseQuantity(quantityOfProduct, insertedId, price);
        }
    })
}

//updates the quantity of the product
function updateDB(insertedId, quantityPurchased){
    var sql = "UPDATE products SET stock_quantity = " + quantityPurchased + " WHERE id = " + insertedId + "";
	connection.query(sql, function (err, results) {
		if (err) throw err;
		console.log(chalk.magenta(results.affectedRows + " record has been updated! Thank you!"));
	});
	connection.end();
}
