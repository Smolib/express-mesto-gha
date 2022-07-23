const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const {
  createUser, login,
} = require('../controllers/users');

router.get('/', (req, res) => {
  res.status(200);
  res.send('hi!');
});

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
router.use(auth);
router.use(userRouter);
router.use(cardRouter);
router.use('*', (req, res) => {
  res.status(404);
  res.send({ message: 'Страница не найдена' });
});

module.exports = router;
