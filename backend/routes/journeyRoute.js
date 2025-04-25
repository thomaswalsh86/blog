const express = require('express');
const router = express.Router();
const {
    getJourneyPlan,
    createJourneyPlan,
    updateJourneyPlan,
    deleteJourneyPlan
} = require('../controllers/journeyController');

const { verifyToken } = require('../middleware/authMiddleware');


router.get('/', verifyToken, getJourneyPlan);
router.post('/', verifyToken, createJourneyPlan);
router.put('/:id', verifyToken, updateJourneyPlan);
router.delete('/:id', verifyToken, deleteJourneyPlan);

module.exports = router;
