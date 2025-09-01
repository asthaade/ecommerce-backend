const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product must have a name'],
    trim: true,
    maxlength: [100, 'Product name must not exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product must have a description'],
    maxlength: [1000, 'Description must not exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product must have a price'],
    min: [0, 'Price must be a positive number']
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Product must belong to a category']
  },
  stock: {
    type: Number,
    required: [true, 'Product must have stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  images: [String],
  sku: {
    type: String,
    unique: true,
    required: [true, 'Product must have a SKU']
  },
  attributes: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    color: String,
    brand: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
productSchema.index({ category: 1, price: 1 });
productSchema.index({ sku: 1 });

// Virtual for checking if stock is low
productSchema.virtual('isLowStock').get(function() {
  return this.stock <= this.lowStockThreshold;
});

module.exports = mongoose.model('Product', productSchema);