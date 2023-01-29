const { constants } = require('http2');
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner'])
    .then((cards) => res.send(cards))
    .catch(() => res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы неправильные данные',
        });
      } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Произошла ошибка' });
      }
      return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: false },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.status(constants.HTTP_STATUS_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные карточки.' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере.' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: false },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        return res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.send(card);
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(constants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные карточки.' });
      }
      return res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
