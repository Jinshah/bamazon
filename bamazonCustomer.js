var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  viewProduct();
});
var table = new Table({
  head: ["Item ID", "Product Name", "Price"],
  colWidths: [20, 80, 20]
});

function viewProduct() {
  var query = "SELECT * FROM products";
  connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) {
      table.push([
        res[i].item_id,
        res[i].product_name,
        res[i].price.toFixed(2)
      ]);
    }
    console.log(table.toString());
    inquirer
      .prompt([
        {
          name: "ProductID",
          type: "input",
          message: "Enter the ID of the Product you want to buy"
        },
        {
          // Ask user to enter a quantity to purchase
          name: "quantity",
          type: "input",
          message: "How many would you like to buy?",
          validate: function(value) {
            if (isNaN(value) == false) {
              return true;
            } else {
              return false;
            }
          }
        }
      ])
      .then(function(answer) {
        for (var i = 0; i < res.length; i++) {
          if (res[i].item_id == answer.ProductID) {
            var chosenItem = res[i];
            console.log(chosenItem);
          }
        }

        if (chosenItem.stock_quantity <= answer.quantity) {
          console.log("Insufficient quantity!");
          repurchase();
        } else {
          var pSales = parseFloat(chosenItem.product_sales).toFixed(2);
          var updatedstock =
            parseInt(chosenItem.stock_quantity) - parseInt(answer.quantity);
          var totalprice = (
            parseFloat(answer.quantity) * chosenItem.price
          ).toFixed(2);

          var salestotal = (
            parseFloat(totalprice) + parseFloat(pSales)
          ).toFixed(2);
          console.log(salestotal);
          connection.query(
            "UPDATE products SET ?, ? WHERE ?",
            [
              { stock_quantity: updatedstock },
              { product_sales: salestotal },
              { item_id: chosenItem.item_id }
            ],
            function(err, res) {
              console.log(
                chosenItem.product_name +
                  " Purchased Sucessfully!! Updated Stock Level:" +
                  updatedstock
              );
              console.log("Total Purchased Price: " + totalprice);
              repurchase();
            }
          );
        }
      });
  });
}
function repurchase() {
  inquirer
    .prompt({
      // Ask user if he wants to purchase another item
      name: "repurchase",
      type: "list",
      choices: ["Yes", "No"],
      message: "Would you like to purchase another item?"
    })
    .then(function(answer) {
      if (answer.repurchase == "Yes") {
        viewProduct();
      } else {
        console.log("Thanks for shopping with us. Have a great day!");
        connection.end();
      }
    });
}
