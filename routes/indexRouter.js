const { Router } = require('express');
const indexController = require('../controllers/indexController.js')

const indexRouter = Router();

indexRouter.get('/', indexController.getAllEntries);

module.exports = indexRouter;