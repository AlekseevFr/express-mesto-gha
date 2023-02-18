const { constants } = require('http2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFound } = require('../errors/NotFound');
const { Conflict } = require('../errors/Conflict');
const { BadRequest } = require('../errors/BadRequest');
const { Internal } = require('../errors/Internal');

const login = async (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.status(constants.HTTP_STATUS_OK).send({ token });
    })
    .catch(next);
};
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(constants.HTTP_STATUS_OK).send({ data: users }))
    .catch(next);
};
const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFound('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })).then((user) => {
      const person = user.toObject();
      delete person.password;
      res.send(person);
    })
    .catch((err) => {
      if (err.code === 11000) {
        const conflictError = new Conflict('Пользователь уже зарегестрирован');
        next(conflictError);
      }
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные карточки'));
      } else {
        next(err);
      }
    });
};
const updateUser = (req, res, next) => {
  const userName = req.body.name;
  const userInfo = req.body.about;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name: userName, about: userInfo },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFound('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные карточки'));
      } else {
        const InternalError = new Internal('Ошибка сервера');
        next(InternalError);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const userAvatar = req.body.avatar;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar: userAvatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFound('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные карточки'));
      } else {
        next(new Internal('Ошибка сервера'));
      }
    });
};
module.exports = {
  login,
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
