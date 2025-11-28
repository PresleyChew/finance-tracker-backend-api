import express from 'express'
import analyticControllers from '../controllers/analyticController.js'

const router = express.Router()

// finds how much per bank for this userID
router.get('/spent-per-acc',analyticControllers.spentPerAccount)
// finds how much per category for userID
router.get('/spent-per-category',analyticControllers.spentPerCategory)
// finds how much spent by a specific account
router.get('/acc/:id/total-spent',analyticControllers.totalSpentBySpecificAcc)

export default router