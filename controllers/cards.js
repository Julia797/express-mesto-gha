const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .populate('likes')
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: '«На сервере произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  if (req.params.cardId.match(/^[0-9a-fA-F]{24}$/)) {
    Card.findByIdAndRemove(req.params.cardId)
      .orFail(new Error('NotValidId'))
      .then(() => {
        res.send({ message: 'Карточка удалена' });
      })
      .catch((err) => {
        if (err.message === 'NotValidId') {
          res.status(404).send({ message: 'Карточка с таким id не найдена' });
        } else {
          res.status(500).send({ message: '«На сервере произошла ошибка' });
        }
      });
  } else {
    res.status(400).send({ message: 'Не корректный Id карточки' });
  }
};

module.exports.likeCard = (req, res) => {
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
        res.send(card);
      })
      .catch((err) => {
        if (err.message === 'NotValidId') {
          res.status(404).send({ message: 'Карточка с таким id не найдена' });
        } else {
          res.status(500).send({ message: '«На сервере произошла ошибка' });
        }
      });
  } else {
    res.status(400).send({ message: 'Не корректный Id карточки' });
  }
};

module.exports.dislikeCard = (req, res) => {
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
        res.send(card);
      })
      .catch((err) => {
        if (err.message === 'NotValidId') {
          res.status(404).send({ message: 'Карточка с таким id не найдена' });
        } else {
          res.status(500).send({ message: '«На сервере произошла ошибка' });
        }
      });
  } else {
    res.status(400).send({ message: 'Не корректный Id карточки' });
  }
};
