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

//shows the product list
function showProducts() {
    console.log("\nWelcome to bamazon! Selecting all products for you: \n");
    connection.query("SELECT * FROM products ORDER BY product_name", function (err, results) {
        if (err) throw err;
        for(var i = 0; i < results.length; i++) {
            console.log("~~~~~~~~~~~~showProducts~~~~~~~~~~~~~~~~");
            console.log(chalk.blue("Product: " + results[i].product_name)  + " " + chalk.yellow("\n$" + results[i].price) + chalk.magenta("\nAvailable in Stock: " + results[i].stock_quantity) + chalk.green("\nID: " + results[i].id));
        
        }
        console.log("~~~~~~~~~~~~~~end showProducts~~~~~~~~~~~~~~");
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
        console.log("prova = "+results);
         compareId(answer.orderID, results);

    })
}

//checks if the inserted id exists
function compareId(insertedId, results) {
    console.log("answer : "+insertedId);
    var exists = false;
    for(var c = 0; c < results.length; c++) {
        if(insertedId == results[c].id){
            console.log("si e uguale")
            exists = true;
            var quantityOfProduct = results[c].stock_quantity;
			var price = results[c].price;
            break;
        }
    }
    if(exists){
        chooseQuantity(quantityOfProduct, insertedId, price);
        
    }else{
        //qui inserire il messaggio che dice: prodotto inesistente, inserire un altro id
        console.log("This product does not exist, please choose another one.");
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
		
		if(answer2.quantity <= quantityOfProduct){
			var tot = answer2.quantity*price;
            console.log(chalk.green("Thank you for your purchase, your order was received and the total amount is "+tot));
            updateDB(insertedId, answer2.quantity);
        }else{
            console.log(chalk.red("Unfortunately we don't have enough items available to fulfill your order, please try to lower your quantity!"));
			chooseQuantity(quantityOfProduct, insertedId, price);
        }
    })
}

//updates the quantity of the product
function updateDB(insertedId, quantityPurchased){
    console.log(insertedId+" - "+quantityPurchased);
    var sql = "UPDATE products SET quantity = '"+quantityPurchased+"' WHERE id = '"+insertedId+"'";
    console.log("1");
	connection.query(sql, function (err, results) {
		if (err) throw err;
		console.log(results.affectedRows + " record(s) updated");
	});
	//showProducts();
	connection.end();
}

// //closes connection
// function closeConnection(){
// 	connection.end(function(err) {
// 	  if (err) {
// 		return console.log('error:' + err.message);
// 	  }
// 	  console.log('Close the database connection.');
// 	});	
// }
