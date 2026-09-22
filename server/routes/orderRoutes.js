const express = require('express');
const router = express.Router();
const {
  placeOrder,
  placeCodOrder,
  getMyOrders,
  getOrderDetails,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', placeOrder);
router.post('/cod', placeCodOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderDetails);

module.exports = router;