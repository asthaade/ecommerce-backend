const { generateSalesReport } = require('../services/reportService');

// @desc    Generate sales report
// @route   GET /api/reports/sales
// @access  Private/Admin
exports.generateSalesReport = async (req, res, next) => {
  try {
    const { period } = req.query;
    
    let startDate, endDate;
    endDate = new Date();
    
    switch (period) {
      case 'weekly':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'monthly':
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'daily':
      default:
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 1);
        break;
    }
    
    const reportBuffer = await generateSalesReport(startDate, endDate, period);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${period}_sales_report.pdf`,
      'Content-Length': reportBuffer.length
    });
    
    res.send(reportBuffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};