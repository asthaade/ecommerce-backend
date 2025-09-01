const PDFDocument = require('pdfkit');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Generate sales report
exports.generateSalesReport = async (startDate, endDate, period = 'daily') => {
  try {
    // Create a PDF document
    const doc = new PDFDocument();
    const chunks = [];
    
    // Collect data chunks
    doc.on('data', chunk => chunks.push(chunk));
    
    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });
      
      doc.on('error', reject);
      
      // Set up document content
      doc.fontSize(20).text('Sales Report', { align: 'center' });
      doc.moveDown();
      
      const periodText = period.charAt(0).toUpperCase() + period.slice(1);
      doc.fontSize(14).text(`${periodText} Report: ${startDate.toDateString()} - ${endDate.toDateString()}`);
      doc.moveDown();
      
      // Get sales data
      Order.getSalesAnalytics(startDate, endDate)
        .then(async analytics => {
          if (analytics.length === 0) {
            doc.text('No sales data available for the selected period.');
            doc.end();
            return;
          }
          
          const { totalSales, totalOrders, averageOrderValue } = analytics[0];
          
          doc.text(`Total Sales: $${totalSales.toFixed(2)}`);
          doc.text(`Total Orders: ${totalOrders}`);
          doc.text(`Average Order Value: $${averageOrderValue.toFixed(2)}`);
          doc.moveDown();
          
          // Get sales by category
          const salesByCategory = await Order.aggregate([
            {
              $match: {
                createdAt: { $gte: startDate, $lte: endDate },
                paymentStatus: 'paid'
              }
            },
            { $unwind: '$items' },
            {
              $lookup: {
                from: 'products',
                localField: 'items.product',
                foreignField: '_id',
                as: 'product'
              }
            },
            { $unwind: '$product' },
            {
              $lookup: {
                from: 'categories',
                localField: 'product.category',
                foreignField: '_id',
                as: 'category'
              }
            },
            { $unwind: '$category' },
            {
              $group: {
                _id: '$category._id',
                categoryName: { $first: '$category.name' },
                totalSales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                totalItems: { $sum: '$items.quantity' }
              }
            },
            { $sort: { totalSales: -1 } }
          ]);
          
          if (salesByCategory.length > 0) {
            doc.text('Sales by Category:');
            doc.moveDown(0.5);
            
            salesByCategory.forEach(category => {
              doc.text(`${category.categoryName}: $${category.totalSales.toFixed(2)} (${category.totalItems} items)`);
            });
            
            doc.moveDown();
          }
          
          // Get top selling products
          const topProducts = await Order.aggregate([
            {
              $match: {
                createdAt: { $gte: startDate, $lte: endDate },
                paymentStatus: 'paid'
              }
            },
            { $unwind: '$items' },
            {
              $lookup: {
                from: 'products',
                localField: 'items.product',
                foreignField: '_id',
                as: 'product'
              }
            },
            { $unwind: '$product' },
            {
              $group: {
                _id: '$product._id',
                productName: { $first: '$product.name' },
                totalSales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                totalQuantity: { $sum: '$items.quantity' }
              }
            },
            { $sort: { totalSales: -1 } },
            { $limit: 10 }
          ]);
          
          if (topProducts.length > 0) {
            doc.text('Top Selling Products:');
            doc.moveDown(0.5);
            
            topProducts.forEach((product, index) => {
              doc.text(`${index + 1}. ${product.productName}: $${product.totalSales.toFixed(2)} (${product.totalQuantity} sold)`);
            });
          }
          
          doc.end();
        })
        .catch(error => {
          doc.text('Error generating report data.');
          doc.end();
          reject(error);
        });
    });
  } catch (error) {
    throw error;
  }
};