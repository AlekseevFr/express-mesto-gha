const jwt = require('jsonwebtoken');
const { UnAuthorized } = require('../errors/UnAuthorized');

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      const err = new UnAuthorized('Необходима авторизация');
      next(err);
    }
    let payload;
    const token = authorization.replace('Bearer ', '');

    try {
      payload = jwt.verify(token, 'super-strong-secret');
    } catch (err) {
      const error = new UnAuthorized(
        'Необходима авторизация',
      );
      next(error);
    }
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};
