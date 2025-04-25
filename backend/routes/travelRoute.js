const express = require('express');
const router = express.Router();

const {
  getTravelLogsByUser,
  createTravelLog,
  updateTravelLog,
  deleteTravelLog
} = require('../controllers/travelController');

const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getTravelLogsByUser);
router.post('/', verifyToken, createTravelLog);
router.put('/:id', verifyToken, updateTravelLog);
router.delete('/:id', verifyToken, deleteTravelLog);

module.exports = router;
