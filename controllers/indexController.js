const dbHandler = require('../db/queries');

exports.getAllEntries = async function(req, res) {
    const rows = await dbHandler.getAllInventory()
    res.render('index', {
        title: 'Inventory',
        rows,
    });
};