const { Router } = require('express');
const indexController = require('../controllers/indexController.js')

const indexRouter = Router();

indexRouter.get('/', indexController.getAllEntries);

indexRouter.get('/search', indexController.getSearchedProducts);

indexRouter.get('/add', indexController.getAddProducts);
indexRouter.post('/add', indexController.postAddProducts);

module.exports = indexRouter;