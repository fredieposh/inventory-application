const { Pool } = require('pg');

const pool = new Pool({
    connectionString: "postgresql://maorgo92@localhost:5432/inventory_app",
});

exports.getAllInventory = async function () {
    const { rows } = await pool.query('SELECT * FROM inventory');
    return rows;
};

exports.getProductInfo = async function (productName) {
    const { rows } = await pool.query('SELECT * FROM inventory WHERE product_name = ($1)', [productName]);
    return rows;
};

exports.getAllCategories = async function() {
    const { rows } = await pool.query('SELECT * FROM categories');
    return rows;
};

exports.isProductExists = async function(productName, categoryName) {
    const { rows } = await pool.query('SELECT * FROM inventory WHERE product_name = ($1) AND category = ($2)',[productName, categoryName]);
    return rows.length > 0;
};