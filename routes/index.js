const express = require('express');
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const users = require('./users');
const cards = require('./cards');
const auth = require('../middlewares/auth');
const { NotFound } = require('../errors/NotFound');
const { login, createUser } = require('../controllers/users');

router.all('*', express.json());

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(/^https?:\/\/(?:w{3}\.)?(?:[a-z0-9]+[a-z0-9-]*\.)+[a-z]{2,}(?::[0-9]+)?(?:\/\S*)?#?$/i),
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
