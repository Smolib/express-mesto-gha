const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, putLikeCard, deleteLikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().uri({ scheme: ['http', 'https'] }),
  }).unknown(true),
}), createCard);
router.delete(
  '/cards/:cardId',
  celebrate({ params: Joi.string().min(24).max(24) }),
  deleteCard,
);
router.put(
  '/cards/:cardId/likes',
  celebrate({ params: Joi.string().min(24).max(24) }),
  putLikeCard,
);
router.delete(
  '/cards/:cardId/likes',
  celebrate({ params: Joi.string().min(24).max(24) }),
  deleteLikeCard,
);

module.exports = router;
