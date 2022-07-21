const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

const getUserMe = (req, res) => {
  User.findById(req.user.id).then((user) => res.status(ok).send(user))
    .catch(() => {
      res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
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

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, { maxAge: 3600000, httpOnly: true })
        .end();
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports = {
  getUser,
  getUsers,
  getUserMe,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
