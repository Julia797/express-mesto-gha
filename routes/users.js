const router = require('express').Router();

const { createUser, getUsers, getUserId } = require('../controllers/users');

/*  const {
  getUsers, getUserId, createUser, editProfile, editAvatar,
} = require('../controllers/users');*/

// GET /users — возвращает всех пользователей
// GET /users/:userId - возвращает пользователя по _id
// POST /users — создаёт пользователя
// PATCH /users/me — обновляет профиль
// PATCH /users/me/avatar — обновляет аватар

router.get('/', getUsers);
// router.get('/:userId', getUserId);
router.post('/', createUser);
// router.patch('/me', editProfile);
// router.patch('/me/avatar', editAvatar);

module.exports = router;
