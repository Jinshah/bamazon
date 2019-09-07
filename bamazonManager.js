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
  managerOptions();
});
var table = new Table({
  head: ["Item ID", "Item", "Department", "Price", "Qnty"],
  colWidths: [10, 40, 35, 10, 10]
});

function managerOptions() {
  inquirer
    .prompt({
      name: "manageroptions",
      type: "list",
      message: "Welcome to Bamazon! What would like to do today?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ]
    })
    .then(function(answer) {
      switch (answer.manageroptions) {
        case "View Products for Sale":
          viewProductForSale();
          break;

        case "View Low Inventory":
          viewLowInventory();
          break;

        case "Add to Inventory":
          addToInventory();
          break;

        case "Add New Product":
          addNewProduct();
          break;
      }
    });
}
function viewProductForSale() {
  var query = "SELECT * FROM products";
  connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) {
      table.push([
        res[i].item_id,
        res[i].product_name,
        res[i].department_name,
        res[i].price,
        res[i].stock_quantity
      ]);
    }
    console.log(table.toString());
    connection.close;
    remanage();
  });
}
function viewLowInventory() {
  var query = "SELECT * FROM products WHERE products.stock_quantity < 5";
  connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) {
      table.push([
        res[i].item_id,
        res[i].product_name,
        res[i].department_name,
        res[i].price,
        res[i].stock_quantity
      ]);
    }
    console.log(table.toString());
    connection.close;
    remanage();
  });
}
function addToInventory() {
  connection.query("SELECT * FROM Products", function(err, res) {
    inquirer
      .prompt([
        {
          // Ask user to choose a product to purchase
          name: "choice",
          type: "list",
          message: "Select the Product to add inventory",
          choices: function(value) {
            var choiceArray = [];
            for (var i = 0; i < res.length; i++) {
              choiceArray.push(res[i].product_name);
            }
            return choiceArray;
          }
        },
        {
          name: "quantity",
          type: "input",
          message: "How many would you like to add?",
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
          if (res[i].product_name == answer.choice) {
            var chosenItem = res[i];
          }
        }
        var updateStock =
          parseInt(chosenItem.stock_quantity) + parseInt(answer.quantity);
        var query = connection.query(
          "UPDATE products SET ? WHERE ?",
          [{ stock_quantity: updateStock }, { item_id: chosenItem.item_id }],
          function(err, res) {
            if (err) throw err;
            console.log(
              "Stock Updated Sucessfully!! Updated Stock Level:" + updateStock
            );
            remanage();
          }
        );
      });
    //connection.close;
  });
}
dept = [];
function addNewProduct() {
  connection.query("SELECT department_name FROM departments", function(
    err,
    res
  ) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      dept.push(res[i].department_name);
    }
    connection.close;
  });

  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "Enter the name of the product to add to the inventory.",
        validate: function(value) {
          if (value == null || value == "") {
            return false;
          } else {
            return true;
          }
        }
      },
      {
        name: "department",
        type: "list",
        choices: dept,
        message: "Select department for the new product."
      },
      {
        name: "price",
        type: "input",
        message: "Enter price for a single new product.",
        validate: function(value) {
          if (value == null || value == "") {
            return false;
          } else {
            return true;
          }
        }
      },
      {
        name: "qnty",
        type: "input",
        message: "Enter the stock of products in inventory.",
        validate: function(value) {
          if (value == null || value == "") {
            return false;
          } else {
            return true;
          }
        }
      },
      {
        name: "sales",
        type: "input",
        message: "Enter the product sales value for this item.",
        validate: function(value) {
          if (value == null || value == "") {
            return false;
          } else {
            return true;
          }
        }
      }
    ])
    .then(function(answers) {
      var query = connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answers.item,
          department_name: answers.department,
          price: answers.price,
          stock_quantity: answers.qnty,
          product_sales: answers.sales
        },
        function(err, res) {
          if (err) throw err;
          console.log(res.affectedRows + "row affected. Product inserted!\n");
          connection.end;
          remanage();
        }
      );
    });
}
function remanage() {
  inquirer
    .prompt({
      // Ask user if he wants to purchase another item
      name: "remanage",
      type: "list",
      choices: ["Yes", "No"],
      message: "Would you like to manage item?"
    })
    .then(function(answer) {
      if (answer.remanage == "Yes") {
        managerOptions();
      } else {
        console.log("Thanks for shopping with us. Have a great day!");
        connection.end();
      }
    });
}
