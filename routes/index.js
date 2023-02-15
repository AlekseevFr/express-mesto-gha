const express = require('express');
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const users = require('./users');
const cards = require('./cards');
const auth = require('../middlewares/auth');
const { NotFound } = require('../errors/NotFound');
const { login, createUser } = require('../controllers/users');

router.all('*', express.json());

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required()
      .default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).required()
      .default('Исследователь'),
    avatar: Joi.string().regex(/^https?:\/\/(?:w{3}\.)*\S*#?$/i)
      .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }),
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required()
      .default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).required()
      .default('Исследователь'),
    avatar: Joi.string().regex(/^https?:\/\/(?:w{3}\.)*\S*#?$/i)
      .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }),
}), login);

router.all('*', auth);

router.use('/users', users);
router.use('/cards', cards);

router.all('*', (req, res, next) => {
  next(new NotFound('Запрос не найден'));
});

module.exports = router;
