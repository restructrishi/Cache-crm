import express from 'express'
import { loginController } from './auth.controller'
import { authenticateJWT } from '../../middleware/auth.middleware'
import { requireRole } from '../../middleware/role.guard'

const router = express.Router()

// Ensure body parsing for this isolated router
router.use(express.json())

router.post('/login', loginController)

// Protected route example
router.get('/me', authenticateJWT, (req, res) => {
  res.json({ user: req.user })
})

// Role-based test routes
router.get(
  '/super-admin/test',
  authenticateJWT,
  requireRole(['SUPER_ADMIN']),
  (req, res) => {
    res.json({ message: 'Super Admin access granted' })
  }
)

router.get(
  '/org-admin/test',
  authenticateJWT,
  requireRole(['ORG_ADMIN']),
  (req, res) => {
    res.json({ message: 'Org Admin access granted' })
  }
)

export default router
