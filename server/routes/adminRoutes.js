const express = require('express');
const router = express.Router();
const { protect, authorizeAdmin } = require('../middleware/authMiddleware');
const { 
    getAdminStats, 
    getAllOrders, 
    updateOrderStatus,
    getAllUsers 
} = require('../controllers/adminController');
const { 
    addProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');
const { getBanners, updateBanners } = require('../controllers/bannerController');
const upload = require('../middleware/upload');

// ये सभी रूट्स केवल Admin एक्सेस कर सकता है
router.use(protect, authorizeAdmin);

router.get('/stats', getAdminStats);
router.get('/orders', getAllOrders);
router.put('/order/:id', updateOrderStatus);
router.get('/users', getAllUsers);
router.get('/banners', getBanners);
router.put('/banners', updateBanners);

// Product CRUD for Admin
router.post('/products', upload.array('image', 5), addProduct);
router.put('/products/:id', upload.array('image', 5), updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;