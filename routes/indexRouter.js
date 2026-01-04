const { Router } = require('express');
const indexController = require('../controllers/indexController.js')

const indexRouter = Router();

indexRouter.get('/', indexController.getAllEntries);
indexRouter.get('/search', indexController.getSearchedProducts);

module.exports = indexRouter;