const {query, body, validationResult, matchedData} = require('express-validator');
const dbHandler = require('../db/queries.js');

const categorySearchEmptyErr = 'must not be empty';
const categorySearchLengthErr = 'must be between 2 and 50 letters';

const validateCategory = [
    query('categoryName').trim()
        .notEmpty().withMessage(`Category name ${categorySearchEmptyErr}`)
        .isLength({ min: 2, max: 50 }).withMessage(`Category name ${categorySearchLengthErr}`),
];

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
            });
            return;        
        };

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).render('seacrhCategory', {
                title: 'Search Category',
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