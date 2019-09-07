DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE `departments` (
  `department_id` int(11) NOT NULL,
  `department_name` varchar(80) NOT NULL,
  `over_head_costs` decimal(10,2) NOT NULL
)

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`department_id`, `department_name`, `over_head_costs`) VALUES
(1, 'Electronics', '12000.00'),
(2, 'Clothing and Shoes', '4000.00'),
(3, 'Home and Garden and Kitchen', '8000.00'),
(4, 'Beauty and Health', '9000.00');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `item_id` int(11) NOT NULL,
  `product_name` varchar(80) NOT NULL,
  `department_name` varchar(80) NOT NULL,
  `price` int(11) NOT NULL,
  `stock_quantity` int(11) NOT NULL,
  `product_sales` decimal(10,2) NOT NULL
) 

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`item_id`, `product_name`, `department_name`, `price`, `stock_quantity`, `product_sales`) VALUES
(2, 'Canon Powershot', 'Electronics', 75, 83, '1250.00'),
(3, 'HP Office Pro Printer', 'Electronics', 250, 27, '0.00'),
(4, 'Dell All-In-One PC', 'Electronics', 550, 3, '0.00'),
(5, 'Shiatsu Vibra Chair', 'Electronics', 150, 5, '0.00'),
(8, 'Laptop', 'Electronics', 800, 10, '1000.00'),
(9, 'Laptops', 'Electronics', 900, 10, '1000.00'),
(10, 'Samsung HD TV', 'Electronics', 750, 1, '1500.00'),
(11, 'laptop', 'Electronics', 800, 3, '1000.00');