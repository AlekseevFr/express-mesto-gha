function handleError(err, req, res, next) {
  const { statusCode = 500 } = err;
  let { message } = err;

  if (statusCode === 500) {
    message = 'Ошибка на сервере';
  }

  res.status(statusCode).send({ message });
  next();
}

module.exports = { handleError };
