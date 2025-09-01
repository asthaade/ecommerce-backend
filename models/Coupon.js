const mongoose = require('mongoose');
const validator = require('validator');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon must have a code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description must not exceed 500 characters']
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: [true, 'Coupon must have a discount type']
  },
  discountValue: {
    type: Number,
    required: [true, 'Coupon must have a discount value'],
    min: [0, 'Discount value cannot be negative']
  },
  minOrderAmount: {
    type: Number,
    min: [0, 'Minimum order amount cannot be negative']
  },
  maxDiscountAmount: {
    type: Number,
    min: [0, 'Maximum discount amount cannot be negative']
  },
  startDate: {
    type: Date,
    required: [true, 'Coupon must have a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Coupon must have an end date']
  },
  usageLimit: {
    type: Number,
    min: [0, 'Usage limit cannot be negative']
  },
  usedCount: {
    type: Number,
    default: 0,
    min: [0, 'Used count cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableCategories: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
couponSchema.index({ code: 1 });
couponSchema.index({ startDate: 1, endDate: 1 });

// Virtual for checking if coupon is valid
couponSchema.virtual('isValid').get(function() {
  const now = new Date();
  return this.isActive && 
         now >= this.startDate && 
         now <= this.endDate && 
         (this.usageLimit === 0 || this.usedCount < this.usageLimit);
});

module.exports = mongoose.model('Coupon', couponSchema);