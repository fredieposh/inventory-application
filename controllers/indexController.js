const dbHandler = require('../db/queries');
const { query, validationResult, matchedData } = require('express-validator');

const productSearchEmptyErr =   'must not be empty'
const productSearchLengthErr =  'must be between 2 and 50 letters'

const validateProduct = [
    query('productName').trim()
        .notEmpty().withMessage(`Product name ${productSearchEmptyErr}`)
        .isLength({ min: 2, max: 50 }).withMessage(`Product name ${productSearchLengthErr}`),
];

exports.getAllEntries = async function(req, res) {
    const rows = await dbHandler.getAllInventory()
    res.render('index', {
        title: 'Inventory',
        rows,
    });
};

exports.getSearchedProducts = [
    validateProduct,
    async function(req, res) {
        if(Object.keys(req.query).length === 0 ) {
            res.render('searchProduct', {
                title: 'Search Product',
            });
            return;        
        };

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).render('searchProduct', {
                title: 'Search Product',
                errors: errors.array(),
            })

            return;
        };
        const {productName} = matchedData(req, { locations: ['query'] });
        const rows = await dbHandler.getProductInfo(productName);
        const isFound = rows.length > 0 ? true: false;
        res.render('index', {
            title: 'Product Search Results',
            rows,
            isResults: true,
            isFound,
            productName
        })
    },
]