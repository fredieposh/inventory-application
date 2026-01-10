const {query, body, validationResult, matchedData} = require('express-validator');
const dbHandler = require('../db/queries.js');

const categorySearchEmptyErr = 'must not be empty';
const categorySearchLengthErr = 'must be between 2 and 50 letters';

const validateCategory = [
    query('categoryName').trim()
        .notEmpty().withMessage(`Category name ${categorySearchEmptyErr}`)
        .isLength({ min: 2, max: 50 }).withMessage(`Category name ${categorySearchLengthErr}`),
];

const validateCategoryPost = [
    body('categoryName').trim()
        .notEmpty().withMessage(`Category name ${categorySearchEmptyErr}`)
        .isLength({ min: 2, max: 50 }).withMessage(`Category name ${categorySearchLengthErr}`),
];

const validateUpdateCategory = [
    body('categoryName').trim()
        .notEmpty().withMessage(`Category name ${categorySearchEmptyErr}`)
        .isLength({ min: 2, max: 50 }).withMessage(`Category name ${categorySearchLengthErr}`),
    body('newCategoryName').trim()
        .notEmpty().withMessage(`Category name ${categorySearchEmptyErr}`)
        .isLength({ min: 2, max: 50 }).withMessage(`Category name ${categorySearchLengthErr}`),
];

async function areProductInCategory(categoryName) {
        const products = await dbHandler.getProductsByCategory(categoryName);
        const isFound =  Object.keys(products).length > 0 ? true : false;
        return { products, isFound };
};

exports.getAllCategories = async function(req, res) {
    const rows = await dbHandler.getAllCategories();
    res.render('categories',{
        title: 'Categories',
        rows,
    });
};

exports.getSearchCategory = [
    validateCategory,
    async function(req, res) {
        if(Object.keys(req.query).length === 0 ) {
            res.render('seacrhCategory', {
                title: 'Search Category',
                pageTitle: 'Search Category',
                method: 'GET',
                path: '/categories/search',
            });
            return;        
        };

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).render('seacrhCategory', {
                title: 'Search Category',
                pageTitle: 'Search Category',
                method: 'GET',
                path: '/categories/search',
                errors: errors.array(),
            })
            return;
        };
    
        const { categoryName } = matchedData(req, {locations: ['query']});
        const rows = await dbHandler.getCategoryByName(categoryName);
        console.log(rows);
        const isFound = rows.length > 0 ? true: false;

        res.render('categories', {
            title: 'Categories Search Results',
            rows,
            isResults: true,
            isFound,
            categoryName,
        });        
    },
];

exports.getAddCategory = async function(req, res) {
    res.render('addCategory', {
        title: 'Add Category',
    })
};

exports.postAddCategory = [
    validateCategoryPost,
    async function(req, res) {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.status(400).render('addCategory', {
                title: 'Add Category',
                errors: errors.array(),
            });

            return;
        };

        const newErrors = [];
        const { categoryName } = matchedData(req);
        const rows = await dbHandler.getCategoryByName(categoryName);
        if(Object.keys(rows) > 0) {
            newErrors.push({msg: 'Category already exists'});
            res.status(400).render('addCategory', {
                title: 'addCategory',
                errors: newErrors,
            });
        };

        await dbHandler.addCategory(categoryName);

        res.redirect('/categories');
    },
];

exports.getProdByCat = async function(req, res) {
    res.render('seacrhCategory', {
        title: 'Search Product By Category',
        pageTitle: 'Search Product By Category',
        path: '/categories/showProducts',
        method: 'POST',
    });    
};

exports.postProdByCat = [
  validateCategoryPost,
  async function(req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.render('seacrhCategory', {
            title: 'Search Product By Category',
            pageTitle: 'Search Product By Category',
            path: '/categories/showProducts',
            method: 'POST',
            errors,
        });
        return;
    };

    const { categoryName } = matchedData(req);
    const newErrors = [];

    const rows = await dbHandler.getCategoryByName(categoryName);
    if(Object.keys(rows).length === 0) {
        newErrors.push({ msg: "This category doen't exists", });
        res.render('seacrhCategory', {
            title: 'Search Product By Category',
            pageTitle: 'Search Product By Category',
            path: '/categories/showProducts',
            method: 'POST',
            errors: newErrors,
        });
        return;        
    };

    const { products, isFound } = await areProductInCategory(categoryName);
    console.log(products, isFound);
    res.render('index',{
            title: 'Product Search Results',
            rows: products,
            isResults: true,
            isFound,
            productName: categoryName,
    });
  }, 
];

exports.getUpdateCategories = async function(req, res) {
    const rows = await dbHandler.getCategoryNames();
    const categories = rows.map(row => row['category']);
    
    res.render('updateCategory', {
        title: "Update Category",
        categories,
    });
};

exports.postUpdateCategories = [
    validateUpdateCategory,
    async function(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('updateCategory', {
                title: "Update Category",
                categories,
                errors,
            });   
            return; 
        };
        const newErrors = [];
        const {categoryName, newCategoryName} = matchedData(req);
        const rows = await dbHandler.getCategoryByName(categoryName);

        if(Object.keys(rows).length === 0) {
            newErrors.push({ msg: "This category doen't exists", });
            res.render('updateCategory', {
                title: "Update Category",
                categories,
                errors: newErrors,
            });
            return;        
        };

        await dbHandler.updateCategoryName(categoryName, newCategoryName);

        const { products, isFound } = await areProductInCategory(categoryName);
        if (isFound) {
            await dbHandler.updateProductsCategory(categoryName, newCategoryName);
        };
        
        res.redirect('/categories');
    },
]