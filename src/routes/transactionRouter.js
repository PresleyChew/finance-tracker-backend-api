import express from 'express'
import transactionControllers from '../controllers/transactionController.js'
import { validate } from '../middleware/validation.js'
import { transactionCreationSchema } from '../schemas/transc.js'

const router = express.Router()


router.get('/',transactionControllers.getAll)
router.get('/:id',transactionControllers.getIndiv)
router.post('/',validate(transactionCreationSchema),transactionControllers.createTransaction)
router.delete('/:id',transactionControllers.deleteTransaction)
router.patch('/:id',transactionControllers.editTransaction)

export default router