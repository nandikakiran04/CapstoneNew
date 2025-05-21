const express = require('express');
const axios   = require('axios');
const router  = express.Router();

// Point this at your Expense MS
const EXPENSE_SERVICE_URL = 'http://localhost:5005/api/expenses';

// 1) Proxy the payroll‐aggregation route BEFORE any “/:id” logic
router.post('/payroll', async (req, res) => {
  try {
    const response = await axios.post(
      `${EXPENSE_SERVICE_URL}/payroll`,
      req.body
    );
    res.status(response.status).json(response.data);
  } catch (err) {
    res
      .status(err.response?.status || 500)
      .json({ error: err.response?.data?.error || err.message });
  }
});

// 2) Get all (with query filters)
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(EXPENSE_SERVICE_URL, { params: req.query });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Expense service error' });
  }
});

// 3) Create manually
router.post('/', async (req, res) => {
  try {
    const response = await axios.post(EXPENSE_SERVICE_URL, req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    res
      .status(err.response?.status || 500)
      .json({ error: err.response?.data?.error || err.message });
  }
});

// 4) Get by ID
router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${EXPENSE_SERVICE_URL}/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    res
      .status(err.response?.status || 500)
      .json({ error: err.response?.data?.error || err.message });
  }
});

// 5) Update
router.put('/:id', async (req, res) => {
  try {
    const response = await axios.put(
      `${EXPENSE_SERVICE_URL}/${req.params.id}`,
      req.body
    );
    res.json(response.data);
  } catch (err) {
    res
      .status(err.response?.status || 500)
      .json({ error: err.response?.data?.error || err.message });
  }
});

// 6) Delete
router.delete('/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${EXPENSE_SERVICE_URL}/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    res
      .status(err.response?.status || 500)
      .json({ error: err.response?.data?.error || err.message });
  }
});

module.exports = router;






// // File: api-gateway/src/routes/expenseRoutes.js
// const express = require('express');
// const axios   = require('axios');
// const router  = express.Router();

// // Base URL of the Expense service
// const EXPENSE_SERVICE = 'http://localhost:5005/api/expenses';

// router.get('/', async (req, res) => {
//   try {
//     const response = await axios.get(EXPENSE_SERVICE, { params: req.query });
//     res.status(response.status).json(response.data);
//   } catch (err) {
//     console.error('Expense Service Error [GET /]', err.message);
//     res.status(err.response?.status || 500).json({ error: err.message });
//   }
// });

// router.post('/', async (req, res) => {
//   try {
//     const response = await axios.post(EXPENSE_SERVICE, req.body);
//     res.status(response.status).json(response.data);
//   } catch (err) {
//     console.error('Expense Service Error [POST /]', err.message);
//     res.status(err.response?.status || 500).json({ error: err.message });
//   }
// });

// router.get('/:id', async (req, res) => {
//   try {
//     const response = await axios.get(`${EXPENSE_SERVICE}/${req.params.id}`);
//     res.status(response.status).json(response.data);
//   } catch (err) {
//     console.error(`Expense Service Error [GET /${req.params.id}]`, err.message);
//     res.status(err.response?.status || 500).json({ error: err.message });
//   }
// });

// router.put('/:id', async (req, res) => {
//   try {
//     const response = await axios.put(`${EXPENSE_SERVICE}/${req.params.id}`, req.body);
//     res.status(response.status).json(response.data);
//   } catch (err) {
//     console.error(`Expense Service Error [PUT /${req.params.id}]`, err.message);
//     res.status(err.response?.status || 500).json({ error: err.message });
//   }
// });

// router.delete('/:id', async (req, res) => {
//   try {
//     const response = await axios.delete(`${EXPENSE_SERVICE}/${req.params.id}`);
//     res.status(response.status).json(response.data);
//   } catch (err) {
//     console.error(`Expense Service Error [DELETE /${req.params.id}]`, err.message);
//     res.status(err.response?.status || 500).json({ error: err.message });
//   }
// });

// module.exports = router;

router.post('/months-expense', async (req, res) => {
  try {
    const response = await axios.post(`${EXPENSE_SERVICE_URL}/months-expense`, req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.response?.data?.error || err.message });
  }
});
