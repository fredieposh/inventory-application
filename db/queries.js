const { Pool } = require('pg');

const pool = new Pool({
    connectionString: "postgresql://maorgo92@localhost:5432/inventory_app",
});

function getParamsForProductUpdateQuery(fieldsObj) {
    const fieldsEntries = Object.entries(fieldsObj) 
        .filter(entry => entry[0] !== 'product_name' && entry[1]) ;
    const fields = fieldsEntries.map(entry => entry[0]);
    const values = fieldsEntries.map(entry => entry[1]);
    const stringForQuery = fields.map((field, index) => `${field} = ($${index + 1})`).join(', ');

    return {stringForQuery, values};
};

exports.getAllInventory = async function () {
    const { rows } = await pool.query('SELECT * FROM inventory ORDER BY id;');
    return rows;
};

exports.getAllproductNames = async function() {
    const { rows } = await pool.query("SELECT product_name FROM inventory;");
    return rows.map(row => {return row['product_name']});
}

exports.updateProduct = async function(fieldsObj) {
    const {product_name} = fieldsObj;
    const { stringForQuery, values } = getParamsForProductUpdateQuery(fieldsObj);
    console.log(stringForQuery, '\n', values);

    await pool.query(`
        UPDATE inventory
        SET ${stringForQuery}
        WHERE product_name = '${product_name}';
    `, values);
};

exports.getProductInfo = async function (productName) {
    const { rows } = await pool.query('SELECT * FROM inventory WHERE product_name = ($1);', [productName]);
    return rows;
};

exports.getAllCategories = async function() {
    const { rows } = await pool.query('SELECT * FROM categories ORDER BY id;');
    return rows;
};

exports.isProductExists = async function(productName, categoryName) {
    const { rows } = await pool.query('SELECT * FROM inventory WHERE product_name = ($1) AND category = ($2);',[productName, categoryName]);
    return (rows.length > 0);
};

exports.addProduct = async function(productName, categoryName, price, quantity) {
    await pool.query(`INSERT INTO inventory (product_name, category, price, quantity)
        VALUES ($1, $2, $3, $4);`,[productName, categoryName, price, quantity]);
};

exports.deleteProduct = async function(productName) {
    console.log(productName);
    await pool.query(`
        DELETE FROM inventory WHERE product_name = ($1)
        `, [productName]);
};

exports.getCategoryNames = async function() {
    const { rows } = await pool.query(`SELECT category FROM categories;`);
    return rows;
};

exports.getCategoryByName = async function(categoryName) {
    const { rows } = await pool.query(`SELECT * FROM categories WHERE category = $1;`, [categoryName]);
    return rows;
};

exports.addCategory = async function(categoryName) {
    await pool.query(`
        INSERT INTO categories (category)
        VALUES ($1);`, [categoryName]);
};

exports.getProductsByCategory = async function(categoryName){
    const { rows } = await pool.query(`SELECT * FROM inventory WHERE category = $1`, [categoryName]);
    return rows;
};

exports.updateCategoryName = async function(oldCategoryName, newCategoryName) {
    await pool.query(`
        UPDATE categories
        SET category = $1
        WHERE category = $2;
        `, [newCategoryName, oldCategoryName]
    );
};

exports.updateProductsCategory = async function(oldCategoryName, newCategoryName) {
        await pool.query(`
        UPDATE inventory
        SET category = $1
        WHERE category = $2;
        `, [newCategoryName, oldCategoryName]
    );
};

exports.deleteCategory = async function(categoryName) {
    await pool.query('DELETE FROM categories WHERE category = $1', [categoryName]);
};

exports.deleteCategoryProducts = async function(categoryName) {
    await pool.query('DELETE FROM inventory WHERE category = $1', [categoryName]);
};