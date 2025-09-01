const cron = require('node-cron');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { generateSalesReport } = require('./reportService');
const { sendLowStockAlert } = require('./socketService');

// Schedule daily stock audit
cron.schedule('0 2 * * *', async () => { // Run at 2 AM daily
  try {
    console.log('Running daily stock audit...');
    
    // Find products with low stock
    const lowStockProducts = await Product.find({
      stock: { $lte: { $expr: '$lowStockThreshold' } },
      isActive: true
    });
    
    // Send alerts for low stock products
    lowStockProducts.forEach(product => {
      sendLowStockAlert(product);
    });
    
    console.log(`Stock audit completed. Found ${lowStockProducts.length} products with low stock.`);
  } catch (error) {
    console.error('Error in stock audit:', error);
  }
});

// Schedule weekly sales report generation
cron.schedule('0 3 * * 0', async () => { // Run at 3 AM every Sunday
  try {
    console.log('Generating weekly sales report...');
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    const reportBuffer = await generateSalesReport(startDate, endDate, 'weekly');
    
    // Here you would typically save the report or send it via email
    // For now, we'll just log that it was generated
    console.log('Weekly sales report generated successfully');
  } catch (error) {
    console.error('Error generating weekly sales report:', error);
  }
});

// Schedule monthly sales report generation
cron.schedule('0 4 1 * *', async () => { // Run at 4 AM on the 1st of every month
  try {
    console.log('Generating monthly sales report...');
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    
    const reportBuffer = await generateSalesReport(startDate, endDate, 'monthly');
    
    // Here you would typically save the report or send it via email
    console.log('Monthly sales report generated successfully');
  } catch (error) {
    console.error('Error generating monthly sales report:', error);
  }
});

module.exports = cron;