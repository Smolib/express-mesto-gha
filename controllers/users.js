const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');
const User = require('../models/user');
const {
  ok, created,
} = require('../constants/statuses');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(ok).send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  const { id } = req.params;
  User.findById(id).then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(ok).send(user);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id пользователя'));
      } else next(err);
    });
};

const getUserMe = (req, res, next) => {
  User.findById(req.user._id).then((user) => res.status(ok).send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(created).send({
      name: user.name, about: user.about, avatar: user.avatar, email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Этот email уже занят'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные для создания пользователя'));
      } else next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(ok).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные для обновления данных пользователя'));
      } else next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(ok).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные для обновления данных пользователя'));
      } else next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, { maxAge: 3600000, httpOnly: true })
        .send({
          name: user.name, about: user.about, avatar: user.avatar, email: user.email,
        });
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
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
