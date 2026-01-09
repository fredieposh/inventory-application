const dbHandler = require('../db/queries');
const { query, body, validationResult, matchedData } = require('express-validator');

const productSearchEmptyErr = 'must not be empty';
const productSearchLengthErr = 'must be between 2 and 50 letters';
const productAddPriceNumberErr = 'must be a number with max 2 numbers after the decimal';
const productAddPriceZeroErr = 'must be a greater than 0 ';
const productAddQuantityIntegerErr = 'must be a whole number';

const validateProduct = [
    query('productName').trim()
        .notEmpty().withMessage(`Product name ${productSearchEmptyErr}`)
        .isLength({ min: 2, max: 50 }).withMessage(`Product name ${productSearchLengthErr}`),
];

const validateAddProduct = [
    body("productName").trim()
        .notEmpty().withMessage(`Product name ${productSearchEmptyErr}`)
        .isLength({ min: 2, max: 50 }).withMessage(`Product name ${productSearchLengthErr}`),
    body("categoryName").trim()
        .notEmpty().withMessage(`Product name ${productSearchEmptyErr}`)
        .isLength({ min: 2, max: 50 }).withMessage(`Product name ${productSearchLengthErr}`),
    body("price").trim()
        .notEmpty().withMessage(`Price ${productSearchEmptyErr}`)
        .matches(/^\d+(\.\d{1,2})?$/).withMessage(`Price ${productAddPriceNumberErr}`)
        .isFloat({ min: 0.01 }).withMessage(`Price ${productAddPriceZeroErr}`),
    body("quantity").trim()
        .notEmpty().withMessage(`Quantity ${productSearchEmptyErr}`)
        .matches(/^\d+$/).withMessage(`Quantity ${productAddQuantityIntegerErr}`)
        .isNumeric({ min : 1}).withMessage(`Quantity ${productAddPriceZeroErr}`),
];

const validateUpdateProduct = [
    body("productName").trim()
        .notEmpty().withMessage(`Product name ${productSearchEmptyErr}`)
        .isLength({ min: 2, max: 50 }).withMessage(`Product name ${productSearchLengthErr}`),
    body("price").optional({ values: 'falsy' }).trim()
        .matches(/^\d+(\.\d{1,2})?$/).withMessage(`Price ${productAddPriceNumberErr}`)
        .isFloat({ min: 0.01 }).withMessage(`Price ${productAddPriceZeroErr}`),
    body("quantity").optional({ values: 'falsy' }).trim()
        .matches(/^\d+$/).withMessage(`Quantity ${productAddQuantityIntegerErr}`)
        .isNumeric({ min : 1}).withMessage(`Quantity ${productAddPriceZeroErr}`),
];

exports.getAllEntries = async function(req, res) {
    // debugger;
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
];

exports.getAddProducts = function(req, res) {
    res.render('addProduct', {
        title: 'Add Product',
    });
};

exports.postAddProducts = [
    validateAddProduct,
    async function(req, res) {
        let errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.render('addProduct', {
                title: 'Add Product',
                errors: errors.array(),
            });
            return;
        };

        const { productName, categoryName, price, quantity } = matchedData(req);

        if(await dbHandler.isProductExists(productName, categoryName)) {
            errors = [{msg: `Product with this category already exists`}];
            res.render('addProduct', {
                title: 'Add Product',
                errors,
            });
            return;
        };

        await dbHandler.addProduct(productName, categoryName, price, quantity);
        res.redirect('/');

    }
];

exports.getUpdateProducts = async function(req, res) {
    const productNames = await dbHandler.getAllproductNames();
    console.log(productNames);
    res.render('updateProduct', {
        title: "Update Product",
        productNames,
    });
};

exports.postUpdateProducts = [
    validateUpdateProduct,
    async function(req, res) {
        const productNames = await dbHandler.getAllproductNames();
        let errors = validationResult(req);

        if (!errors.isEmpty()){
            res.render('updateProduct',{
                title: "Update Product",
                errors: errors.array(),
                productNames,
            });
            return;
        };

        const bodyParams = matchedData(req);
        const newErrors = [];

        if (!productNames.includes(bodyParams['productName'])) {
            newErrors.push({msg: "Product name wasn't found in inventory"});
        };

        if (!(
            bodyParams['price'] ||
            bodyParams['quantity']
        )) {
            newErrors.push({msg: "Price or quantity must be filled in " 
                + "order to update the product"});
        };

        if(newErrors.length > 0) {
            res.render('updateProduct',{
                title: "Update Product",
                errors: newErrors,
                productNames,
            });
            return;
        }

        await dbHandler.updateProduct({
            product_name: bodyParams.productName,
            price: bodyParams.price,
            quantity: bodyParams.quantity,
        });

        res.redirect('/');
    },
];
