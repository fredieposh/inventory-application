const { Router } = require('express');
const categoriesController = require('../controllers/categoriesController.js');

const categoryRouter = Router();

categoryRouter.get('/', categoriesController.getAllCategories);

module.exports = categoryRouter;