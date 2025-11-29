import express from 'express'
import analyticControllers from '../controllers/analyticController.js'

const router = express.Router()


router.get('/spent-per-acc',analyticControllers.spentPerAccount)

router.get('/spent-per-category',analyticControllers.spentPerCategory)

router.get('/acc/:id/total-spent',analyticControllers.totalSpentBySpecificAcc)

router.get('/total-spent',analyticControllers.totalSpent)

router.get('/top-categories',analyticControllers.topCategories)

router.get('/acc-ranking',analyticControllers.accountRankings)

export default router