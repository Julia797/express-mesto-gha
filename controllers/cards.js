const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const Card = require('../models/card');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
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

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .populate('likes')
    .then((cards) => res.send(cards))
    // .catch(() => res.status(500).send({ message: '«На сервере произошла ошибка' }));
    .catch((err) => next(err));
};

module.exports.deleteCard = (req, res, next) => {
  if (req.params.cardId.match(/^[0-9a-fA-F]{24}$/)) {
    Card.findByIdAndRemove(req.params.cardId)
      .orFail(new Error('NotValidId'))
      .then(() => {
        res.status(200).send({ message: 'Карточка удалена' });
      })
      .catch((err) => {
        if (err.message === 'NotValidId') {
          // res.status(404).send({ message: 'Карточка с таким id не найдена' });
          next(new NotFoundError('Карточка с таким id не найдена'));
        } else {
        // res.status(500).send({ message: '«На сервере произошла ошибка' });
          next(err);
        }
      });
  } else {
    // res.status(400).send({ message: 'Не корректный Id карточки' });
    next(new BadRequestError('Не корректный Id карточки'));
  }
};

module.exports.likeCard = (req, res, next) => {
  if (req.params.cardId.match(/^[0-9a-fA-F]{24}$/)) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .populate('owner')
      .populate('likes')
      .orFail(new Error('NotValidId'))
      .then((card) => {
        res.status(200).send(card);
      })
      .catch((err) => {
        if (err.message === 'NotValidId') {
          // res.status(404).send({ message: 'Карточка с таким id не найдена' });
          next(new NotFoundError('Карточка с таким id не найдена'));
        } else {
          // res.status(500).send({ message: '«На сервере произошла ошибка' });
          next(err);
        }
      });
  } else {
    // res.status(400).send({ message: 'Не корректный Id карточки' });
    next(new BadRequestError('Не корректный Id карточки'));
  }
};

module.exports.dislikeCard = (req, res, next) => {
  if (req.params.cardId.match(/^[0-9a-fA-F]{24}$/)) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .populate('owner')
      .populate('likes')
      .orFail(new Error('NotValidId'))
      .then((card) => {
        res.status(200).send(card);
      })
      .catch((err) => {
        if (err.message === 'NotValidId') {
          // res.status(404).send({ message: 'Карточка с таким id не найдена' });
          next(new NotFoundError('Карточка с таким id не найдена'));
        } else {
          // res.status(500).send({ message: '«На сервере произошла ошибка' });
          next(err);
        }
      });
  } else {
    // res.status(400).send({ message: 'Не корректный Id карточки' });
    next(new BadRequestError('Не корректный Id карточки'));
  }
};
