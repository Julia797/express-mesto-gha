const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Необходимо заполнить поле "name"'],
      minlength: [2, 'Минимальная длина имени — 2 символа'],
      maxlength: [30, 'Максимальная длина имени — 30 символов'],
    },
    link: {
      type: String,
      required: [true, 'Необходимо заполнить поле "link"'],
      validate: {
        validator(URL) {
          return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(URL);
        },
        message: 'Введите URL',
      },
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },

    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    }],

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('card', cardSchema);
