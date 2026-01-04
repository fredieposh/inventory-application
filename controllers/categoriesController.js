const dbHandler = require('../db/queries.js');

exports.getAllCategories = async function(req, res) {
    const rows = await dbHandler.getAllCategories();
    res.render('categories',{
        title: 'Categories',
        rows,
    });
};