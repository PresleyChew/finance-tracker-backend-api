import express from 'express'
import accountControllers from '../controllers/accountController.js'

const router = express.Router()

// CRUD for accounts
// Get all
router.get('/',accountControllers.getAll)
// Get indiv
router.get('/:id',accountControllers.getIndiv)
// Create
router.post('/',accountControllers.createAccount)
// Update account
router.patch('/:id',accountControllers.updateIndivAccount)
// Delete account
router.delete('/:id',accountControllers.deleteIndivAccount)

export default router