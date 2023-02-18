const { constants } = require('http2');
const User = require('../models/user');

async function getActiveUser(req, res) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь не найден' });
    }

    return res.send(user);
  } catch (err) {
    return res.status(constants.INTERNAL_ERROR).send({ message: 'Произошла ошибка' });
  }
}

module.exports = { getActiveUser };
