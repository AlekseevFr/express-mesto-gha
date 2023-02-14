const { constants } = require('http2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFound } = require('../errors/NotFound');

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password).select('+password')
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.status(constants.HTTP_STATUS_OK).send({ token });
    })

    .catch((err) => {
      next(err);
    });
};

const getUsers = (req, res) => {
  User.find()
    .then((users) => res.send(users))
    .catch(() => res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' }));
};
const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Карточка не найдена');
      }
      return res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Ошибка данных',
        });
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
const updateUser = (req, res) => {
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
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(constants.HTTP_STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Ошибка данных',
        });
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateAvatar = (req, res) => {
  const userAvatar = req.body.avatar;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar: userAvatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Ошибка данных',
        });
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
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
