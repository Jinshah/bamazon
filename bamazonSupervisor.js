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
  supervisorOptions();
});
var table = new Table({
  head: ["Depart ID", "Dept Name", "Over Head", "Product Sales"],
  colWidths: [10, 40, 10, 10]
});

function supervisorOptions() {
  inquirer
    .prompt({
      // Ask user to enter a quantity to purchase
      name: "supervisoroptions",
      type: "list",
      choices: ["View Product Sales by Department", "Create New Department"]
    })
    .then(function(answer) {
      switch (answer.supervisoroptions) {
        case "View Product Sales by Department":
          viewProductSales();
          break;

        case "Create New Department":
          addNewDepartment();
          break;
      }
    });
}

function viewProductSales() {
  var query =
    "SELECT departments.department_id,departments.department_name,departments.over_head_costs,products.product_sales FROM departments LEFT JOIN products ON departments.department_name = products.department_name;";
  connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) {
      table.push([
        res[i].department_id,
        res[i].department_name,
        res[i].over_head_costs,
        res[i].product_sales
      ]);
    }
    console.log(table);
    connection.end();
  });
}
