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

const uploadProductImages = upload.array('image', 5);
const validateProductImageUpload = (req, res, next) => {
    uploadProductImages(req, res, (error) => {
        if (error?.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Maximum 5 photos allowed.',
            });
        }

        if (error) return next(error);
        return next();
    });
};

// ये सभी रूट्स केवल Admin एक्सेस कर सकता है
router.use(protect, authorizeAdmin);

router.get('/stats', getAdminStats);
router.get('/orders', getAllOrders);
router.put('/order/:id', updateOrderStatus);
router.get('/users', getAllUsers);
router.get('/banners', getBanners);
router.put('/banners', updateBanners);

// Product CRUD for Admin
router.post('/products', validateProductImageUpload, addProduct);
router.put('/products/:id', validateProductImageUpload, updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;