const express = require('express');
const router = express.Router();
const traceController = require('../controllers/traceController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, traceController.listTraces);
router.post('/', authMiddleware, traceController.addTrace);

module.exports = router;
