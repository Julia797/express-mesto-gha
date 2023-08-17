const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const User = require('../models/user');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10) // // хешируем пароль
    .then((hash) => User.create({
      name, about, avatar, email, password: hash, // записываем хеш в базу
    })
      .then((user) => res.status(201).send({
        name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user._id,
      }))
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
        } else if (err.name === 'ValidationError') {
          next(new BadRequestError(err.message));
        } else {
          next(err);
        }
      }));
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => next(err));
};

module.exports.getUserId = (req, res, next) => {
  if (req.params.userId.match(/^[0-9a-fA-F]{24}$/)) {
    User.findById(req.params.userId)
      .orFail(new Error('NotValidId'))
      .then((user) => {
        res.status(200).send(user);
      })
      .catch((err) => {
        if (err.message === 'NotValidId') {
          next(new NotFoundError('Пользователь с таким id не найден'));
        } else {
          next(err);
        }
      });
  } else {
    next(new BadRequestError('Не корректный Id'));
  }
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь с таким id не найден'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: 'true', runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь с таким id не найден'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key-mesto', { expiresIn: '7d' }); // создадим токен
      res.status(200).send({ token }); // вернём токен
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};
