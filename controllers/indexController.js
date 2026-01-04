const dbHandler = require('../db/queries');

exports.getAllEntries = async function(req, res) {
    const rows = await dbHandler.getAllInventory()
    res.render('index', {
        title: 'Inventory',
        rows,
    });
};

exports.getSearchedProducts = async function(req, res) {
    if(Object.keys(req.query).length === 0 ) {
        res.render('searchProduct', {
            title: 'searcy',
        });
        return;        
    };
    const {productName} = req.query;
    const rows = await dbHandler.getProductInfo(productName);
    const isFound = rows.length > 0 ? true: false;
    res.render('index', {
        title: 'Product Search Results',
        rows,
        isResults: true,
        isFound,
        productName
    })
};