const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const users = require('./users');
const cards = require('./cards');
const auth = require('../middlewares/auth');
const { NotFound } = require('../errors/NotFound');
const { login, createUser } = require('../controllers/users');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
    }),
  }),
  createUser,
);
router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

router.all('*', auth);

router.use('/users', users);
router.use('/cards', cards);

router.all('*', (req, res, next) => {
  next(new NotFound('Запрос не найден'));
});

module.exports = router;
