const socketIO = require('socket.io');
const Product = require('../models/Product');

let io;

// Initialize socket.io
exports.init = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });
  
  io.on('connection', (socket) => {
    console.log('Client connected');
    
    // Join room for stock updates
    socket.on('subscribe-to-stock', (productId) => {
      socket.join(`stock-${productId}`);
      console.log(`Client subscribed to stock updates for product ${productId}`);
    });
    
    // Leave room for stock updates
    socket.on('unsubscribe-from-stock', (productId) => {
      socket.leave(`stock-${productId}`);
      console.log(`Client unsubscribed from stock updates for product ${productId}`);
    });
    
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
  
  return io;
};

// Get io instance
exports.getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

// Send stock update to clients
exports.sendStockUpdate = (productId, stockData) => {
  const io = this.getIO();
  io.to(`stock-${productId}`).emit('stock-update', stockData);
};

// Send low stock alert to admin
exports.sendLowStockAlert = (product) => {
  const io = this.getIO();
  io.to('admin-room').emit('low-stock-alert', {
    productId: product._id,
    productName: product.name,
    currentStock: product.stock,
    threshold: product.lowStockThreshold
  });
};