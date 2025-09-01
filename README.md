# E-Commerce Backend 

A scalable Node.js backend for an e-commerce platform with real-time features, complex database relations, and comprehensive API documentation.

## Features

- **User Authentication:** JWT-based authentication with role-based access (admin/customer)
- **Product Management:** Full CRUD operations with category relationships
- **Order Processing:** Complete order lifecycle management
- **Real-time Updates:** WebSocket support for stock updates and notifications
- **Reporting:** PDF report generation for sales analytics
- **Admin Dashboard:** Comprehensive admin features with real-time analytics
- **Coupon System:** Flexible discount and promotion system
- **API Documentation:** Swagger/OpenAPI documentation

# API Endpoints

## Authentication

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user (protected


## Products

- GET /api/products - Get all products
- GET /api/products/:id - Get single product
- POST /api/products - Create product (admin only)
- PUT /api/products/:id - Update product (admin only)
- DELETE /api/products/:id - Delete product (admin only)
- GET /api/products/category/:categoryId - Get products by category

## Categories
  
- GET /api/categories - Get all categories
- GET /api/categories/:id - Get single category
- POST /api/categories - Create category (admin only)
- PUT /api/categories/:id - Update category (admin only)
- DELETE /api/categories/:id - Delete category (admin only)

## Orders

- GET /api/orders - Get all orders (admin only)
- GET /api/orders/:id - Get single order
- POST /api/orders - Create new order
- GET /api/orders/myorders - Get current user's orders
- PUT /api/orders/:id/status - Update order status (admin only)

## Coupons

- GET /api/coupons - Get all coupons (admin only)
- GET /api/coupons/:id - Get single coupon (admin only)
- POST /api/coupons - Create coupon (admin only)
- PUT /api/coupons/:id - Update coupon (admin only)
- DELETE /api/coupons/:id - Delete coupon (admin only)
- GET /api/coupons/validate/:code - Validate coupon

## Reports

- GET /api/reports/sales - Generate sales report (admin only)
