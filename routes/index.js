const router = require('express').Router();
const signupRouter = require('./signup');
const signinRouter = require('./signin');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const auth = require('../middlewares/auth');

router.use('/signup', signupRouter);
router.use('/signin', signinRouter);

router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

module.exports = router;
