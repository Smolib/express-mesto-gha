const router = require('express').Router();
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
router.post('/signup', createUser);
router.post('/signin', login);
router.use(auth);
router.use(userRouter);
router.use(cardRouter);
router.use('*', (req, res) => {
  res.status(404);
  res.send({ message: 'Страница не найдена' });
});

module.exports = router;
