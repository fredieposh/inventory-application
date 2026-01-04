const { Pool } = require('pg');

const pool = new Pool({
    connectionString: "postgresql://maorgo92@localhost:5432/inventory_app",
});

exports.getAllInventory = async function () {
    const { rows } = await pool.query('SELECT * FROM inventory');
    return rows;
};

exports.getAllCategories = async function() {
    const { rows } = await pool.query('SELECT * FROM categories');
    return rows;
};