const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const Card = require('../models/card');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .populate('likes')
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

module.exports.deleteCard = (req, res, next) => {
  if (req.params.cardId.match(/^[0-9a-fA-F]{24}$/)) {
    Card.findById(req.params.cardId)
      .orFail(new Error('NotValidId'))
      .then((card) => {
        if (!card.owner.equals(req.user._id)) {
          throw new ForbiddenError('Нет прав для удаления карточки');
        }
        Card.deleteOne(card)
          .then(() => {
            res.status(200).send({ message: 'Карточка удалена' });
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        if (err.message === 'NotValidId') {
          next(new NotFoundError('Карточка с таким id не найдена'));
        } else {
          next(err);
        }
      });
  } else {
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
          next(new NotFoundError('Карточка с таким id не найдена'));
        } else {
          next(err);
        }
      });
  } else {
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
          next(new NotFoundError('Карточка с таким id не найдена'));
        } else {
          next(err);
        }
      });
  } else {
    next(new BadRequestError('Не корректный Id карточки'));
  }
};
