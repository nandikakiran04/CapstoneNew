const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/payrollController');

// Must register specific routes before the “/:id” catch-all
router.get('/employee/:employeeId', controller.getByEmployee);
router.get('/month-year/:month/:year', controller.getByMonthYear);

router.get('/',       controller.getAll);
router.get('/:id',    controller.getById);

router.post('/',      controller.create);
router.post('/calculate', controller.calculatePayroll);

router.put('/:id',    controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
