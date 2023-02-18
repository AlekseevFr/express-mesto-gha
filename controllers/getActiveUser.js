const { Internal } = require('../errors/Internal');
const { NotFound } = require('../errors/NotFound');
const User = require('../models/user');

async function getActiveUser(req, res, next) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return next(new NotFound('Пользователь не найден'));
    }
    return res.send(user);
  } catch (err) {
    return next(new Internal('Ошибка сервера'));
  }
}

module.exports = { getActiveUser };
