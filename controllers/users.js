const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const User = require('../models/user');

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(400).send({ message: err.message });
        next(new BadRequestError(err.message));
      } else {
        // res.status(500).send({ message: 'На сервере произошла ошибка' });
        next(err);
      }
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    // .catch(() => res.status(500).send({ message: '«На сервере произошла ошибка' }));
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
          // res.status(404).send({ message: 'Пользователь с таким id не найден' });
          next(new NotFoundError('Пользователь с таким id не найден'));
        } else {
          // res.status(500).send({ message: '«На сервере произошла ошибка' });
          next(err);
        }
      });
  } else {
    // res.status(400).send({ message: 'Не корректный Id' });
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
        // res.status(404).send({ message: 'Пользователь с таким id не найден' });
        next(new NotFoundError('Пользователь с таким id не найден'));
      } else if (err.name === 'ValidationError') {
        // res.status(400).send({ message: err.message });
        next(new BadRequestError(err.message));
      } else {
        // res.status(500).send({ message: 'На сервере произошла ошибка' });
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
        // res.status(404).send({ message: 'Пользователь с таким id не найден' });
        next(new NotFoundError('Пользователь с таким id не найден'));
      } else if (err.name === 'ValidationError') {
        // res.status(400).send({ message: err.message });
        next(new BadRequestError(err.message));
      } else {
        // res.status(500).send({ message: 'На сервере произошла ошибка' });
        next(err);
      }
    });
};
