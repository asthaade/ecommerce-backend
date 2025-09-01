const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category must have a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Category name must not exceed 50 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description must not exceed 500 characters']
  },
  parentCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for better performance
categorySchema.index({ name: 1 });

module.exports = mongoose.model('Category', categorySchema);