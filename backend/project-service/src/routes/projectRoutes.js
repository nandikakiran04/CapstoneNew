const express = require('express');
const router = express.Router();
const controller = require('../controllers/projectController'); // Ensure this path is correct

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);
router.post('/monthly-income', controller.calculateMonthlyIncome);

module.exports = router;
