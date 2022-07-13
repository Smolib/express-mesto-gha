const User = require('../models/user');
const {
  ok, created, badRequest, notFound, internalServerError,
} = require('../constants/statuses');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(ok).send(users))
    .catch(() => res.status(internalServerError).send({ message: 'На сервере произошла ошибка' }));
};

const getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id).then((user) => {
    if (!user) {
      res.status(notFound).send({ message: 'Пользователь не найден' });
      return;
    }
    res.status(ok).send(user);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Некорректный id пользователя' });
        return;
      }
      res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
};

const createUser = (req, res) => {
  User.create({ ...req.body })
    .then((user) => res.status(created).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Некорректные данные для создания пользователя' });
        return;
      }
      res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(notFound).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(ok).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Некорректные данные для обновления данных пользователя' });
        return;
      }
      res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(notFound).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(ok).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Некорректные данные для обновления данных пользователя' });
        return;
      }
      res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateUser,
  updateAvatar,
};
