const { constants } = require('http2');
const User = require('../models/user');

async function getActiveUser(req, res) {
  console.log('getActive', req);

  try {
    const userId = req.params.userId || req.user._id;
    const user = await User.findById(userId);
    console.log('user', req.user, user);

    if (!user) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь не найден' });
    }

    return res.send(user);
  } catch (err) {
    console.log('err', err);
    return res.status(constants.INTERNAL_ERROR).send({ message: 'Произошла ошибка' });
  }
}

module.exports = { getActiveUser };
