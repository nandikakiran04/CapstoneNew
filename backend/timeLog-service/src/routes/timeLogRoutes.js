const express = require('express');
const router = express.Router();
const controller = require('../controllers/timeLogController');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
router.post('/bulk',  controller.createBulk);
router.post('/logged-employees', controller.getLoggedEmployees);
module.exports = router;
