const Card = require('../models/card');
const {
  ok, created, badRequest, notFound, internalServerError,
} = require('../constants/statuses');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(ok).send(cards))
    .catch(() => res.status(internalServerError).send({ message: 'На сервере произошла ошибка' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(created).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Некорректные данные для создания карточки' });
        return;
      }
      res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(notFound).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(ok).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Некорректные данные для удаления карточки' });
        return;
      }
      res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
};

const putLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(notFound).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(ok).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Некорректные данные для постановки лайка' });
        return;
      }
      res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(notFound).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(ok).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Некорректные данные для снятия лайка' });
        return;
      }
      res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLikeCard,
  deleteLikeCard,
};
