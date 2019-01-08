
CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT  PRIMARY KEY,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL

);

DROP TABLE products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Echo Dot", "Tech", 29.99, 14);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Levi's Blue Jeans", "Clothing", 59.99, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Blue Pens", "Office", 1.99, 8);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Smart Tv", "Tech", 529.00, 4);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Laptop", "Tech", 659.75, 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Flour", "Food", 3.29, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("XYZ", "Food", 24.29, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Sweater", "Clothing", 19.99, 6);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bread", "Food", 0.99, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Stapler", "Office", 2.29, 9);

SELECT * FROM products ORDER BY product_name;


 ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';