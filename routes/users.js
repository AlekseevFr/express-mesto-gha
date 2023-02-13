const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getActiveUser } = require('../controllers/getActiveUser');
const {
  getUsers, getUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/users/me', getActiveUser);
router.get('/', getUsers);
router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
  }),
  getUser,
);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser,
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
    }),
  }),
  updateAvatar,
);

module.exports = router;
