//Inventory
function inventory() {
    var table = new Table({
        head: ["Item ID", "Product for Sale", "Department", "Price"],
        colWidths: [10, 60, 20, 10],
    });

    listInventory();

    function listInventory() {
        //Variable creation from DB connection
        connection.query("SELECT * FROM products", function (err, results) {
            for (var i = 0; i < results.length; i++) {

                var itemId = results[i].item_id,
                    productName = results[i].product_name,
                    departmentName = results[i].department_name,
                    price = results[i].price;

                table.push(
                    [itemId, productName, departmentName, price]
                );
            }
            console.log("");
            console.log("================================ CURRENT BAMAZON PRODUCTS FOR SALE =====================================");
            console.log("");
            console.log(table.toString());
            console.log("");
            // connection.end();
            continuePrompt();
        });
    }
}

//buyer Purchase
function continuePrompt() {
    inquirer.prompt([{
        type: "confirm",
        name: "continue",
        message: "Would you like to buy anything?",
        default: true
    }])
        .then(function (buyer) {
            if (buyer.continue === true) {
                selectionPrompt();
            } else {
                
                console.log("Thank you! Come back soon!");
                
                start();
            }
            // connection.end();
        });
}

//Item selection and Quantity desired
function selectionPrompt() {
    inquirer.prompt([{
        type: "input",
        name: "inputId",
        message: "Please enter the item ID you like to buy.",
    },
    {
        type: "input",
        name: "inputNumber",
        message: "How many units of this item would you like to buy?",
    }
    ])
        .then(function (buyerPurchase) {
            //connect to database to find stock_quantity in database. If buyer quantity input is greater than stock, decline purchase.
            connection.query("SELECT * FROM products WHERE item_id=?", buyerPurchase.inputId, function (err, results) {
                for (var i = 0; i < results.length; i++) {

                    if (buyerPurchase.inputNumber > results[i].stock_quantity) {
                        
                        console.log("Sorry! Not enough in stock. Please try again later.");
                        
                        start();

                    } else {
                        //list item information for buyer for confirm prompt
                        console.log("Great!!! We can fulfill your order.");
                        console.log("You have selected:");
                        console.log("------------------");
                        console.log("Item: " + results[i].product_name);
                        console.log("Department: " + results[i].department_name);
                        console.log("Price: " + results[i].price);
                        console.log("Quantity: " + buyerPurchase.inputNumber);
                        console.log("------------------");
                        console.log("Total: " + results[i].price * buyerPurchase.inputNumber);
                        console.log("------------------");
                        console.log("");
                        var newStock = (results[i].stock_quantity - buyerPurchase.inputNumber);
                        var purchaseId = (buyerPurchase.inputId);
                        confirmPrompt(newStock, purchaseId);
                        // connection.end();
                    }
                }
            });
        });
}

//Confirm Purchase  
function confirmPrompt(newStock, purchaseId) {
    inquirer.prompt([{
        type: "confirm",
        name: "confirmPurchase",
        message: "Are you sure you want to buy this?",
        default: true
    }])
        .then(function (buyerConfirm) {
            if (buyerConfirm.confirmPurchase === true) {
                //if buyer confirms purchase, update mysql database with new stock quantity by subtracting buyer quantity purchased.
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: newStock
                }, {
                    item_id: purchaseId
                }])
                // function (err, results) {});
                console.log("Transaction completed!");
                start();
            } else {
                
                console.log("No worries...Maybe next time!");
                start();
            }
        });
}