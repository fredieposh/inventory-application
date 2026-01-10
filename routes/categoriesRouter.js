const { Router } = require('express');
const categoriesController = require('../controllers/categoriesController.js');

const categoryRouter = Router();

categoryRouter.get('/', categoriesController.getAllCategories);

categoryRouter.get('/search', categoriesController.getSearchCategory);

categoryRouter.get('/add', categoriesController.getAddCategory);
categoryRouter.post('/add', categoriesController.postAddCategory);

categoryRouter.get('/showProducts', categoriesController.getProdByCat);
categoryRouter.post('/showProducts', categoriesController.postProdByCat);

module.exports = categoryRouter;