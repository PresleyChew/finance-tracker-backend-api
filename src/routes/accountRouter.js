import express from 'express'
import accountControllers from '../controllers/accountController.js'
import {validate} from '../middleware/validation.js'
import {accountCreationSchema} from '../schemas/acc.js'

const router = express.Router()

// CRUD for accounts
// Get all
router.get('/',accountControllers.getAll)
// Get indiv
router.get('/:id',accountControllers.getIndiv)
// Create
router.post('/',validate(accountCreationSchema),accountControllers.createAccount)
// Update account
router.patch('/:id',accountControllers.updateIndivAccount)
// Delete account
router.delete('/:id',accountControllers.deleteIndivAccount)


export default router