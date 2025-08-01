const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const { authMiddleware, adminOnly } = require('../middlewares/auth');

router.use(authMiddleware);  // ✅ login required
router.use(adminOnly);       // ✅ admin required

router.get('/', getAllUsers);           // GET /users
router.get('/:id', getUserById);        // GET /users/:id
router.put('/:id', updateUser);         // PUT /users/:id
router.delete('/:id', deleteUser);      // DELETE /users/:id
router.post('/', createUser);           // POST /users

module.exports = router;
