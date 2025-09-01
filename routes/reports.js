const express = require('express');
const { generateSalesReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/sales')
  .get(protect, authorize('admin'), generateSalesReport);

module.exports = router;