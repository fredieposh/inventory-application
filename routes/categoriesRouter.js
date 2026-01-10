const { Router } = require('express');
const categoriesController = require('../controllers/categoriesController.js');

const categoryRouter = Router();

categoryRouter.get('/', categoriesController.getAllCategories);
categoryRouter.get('/search', categoriesController.getSearchCategory);

module.exports = categoryRouter;