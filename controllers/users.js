const { constants } = require('http2');
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find()
    .then((users) => res.send(users))
    .catch(() => res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};
const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Произошла ошибка' });
      }
      return res.status(constants.INTERNAL_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
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
    .then((user) => res.status(constants.HTTP_STATUS_OK).send({ data: user }))
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
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Ошибка данных',
        });
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
