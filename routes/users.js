const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getActiveUser } = require('../controllers/getActiveUser');
const {
  getUsers, getUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/me', getActiveUser);
router.get('/', getUsers);
router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
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
      avatar: Joi.string().regex(/^https?:\/\/(?:w{3}\.)?(?:[a-z0-9]+[a-z0-9-]*\.)+[a-z]{2,}(?::[0-9]+)?(?:\/\S*)?#?$/i),
    }),
  }),
  updateAvatar,
);

module.exports = router;
