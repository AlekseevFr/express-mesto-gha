const User = require('../models/user');

const getUsers = (req, res) => {
  User.find()
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      console.log('user', user);
      return res.send(user);
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};
const updateUser = (req, res) => {
  const userName = req.body.name;
  const userInfo = req.body.about;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name: userName, about: userInfo }, { new: true })
    .then(() => {
      res.send('Информация профиля обновлена');
    });
};

const updateAvatar = (req, res) => {
  const userAvatar = req.body.avatar;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar: userAvatar }, { new: true })
    .then(() => {
      res.send('Аватар обновлен');
    });
};
module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
