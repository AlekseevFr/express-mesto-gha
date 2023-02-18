const { constants } = require('http2');
const Card = require('../models/card');
const { BadRequest } = require('../errors/BadRequest');
const { Internal } = require('../errors/Internal');
const { NotFound } = require('../errors/NotFound');
const { Forbidden } = require('../errors/Forbidden');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(constants.HTTP_STATUS_OK).send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные карточки'));
      } else {
        next(new Internal('Ошибка сервера'));
      }
    });
};
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId).populate('owner')
    .then((card) => {
      if (!card) {
        return next(new NotFound('Карточка не найдена'));
      }

      const ownerId = card.owner.id;
      const userId = req.user._id;

      if (ownerId !== userId) {
        return next(new Forbidden('Удалить можно только свою карточку'));
      }

      return Card.findByIdAndRemove(cardId).then((resp) => res.send(resp));
    })
    .catch(next);
};
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: false },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        return next(new NotFound('Карточка не найдена'));
      }
      return res.status(constants.HTTP_STATUS_OK).send({ data: card });
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: false },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        return next(new NotFound('Карточка не найдена'));
      }
      return res.send(card);
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректные данные карточки'));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
