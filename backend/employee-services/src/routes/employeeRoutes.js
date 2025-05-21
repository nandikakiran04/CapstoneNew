const express    = require('express');
const controller = require('../controllers/employeeController');
const router     = express.Router();

router.get('/',      controller.getAll);
router.get('/:id',   controller.getById);
router.get('/email/:email', controller.getByEmail);
router.post('/',     controller.create);
router.put('/:id',   controller.update);
router.delete('/:id',controller.remove);

module.exports = router;
