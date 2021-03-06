const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, putLikeCard, deleteLikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
  }).unknown(true),
}), createCard);
router.delete(
  '/cards/:cardId',
  celebrate({ params: Joi.object().keys({ cardId: Joi.string().length(24).hex() }) }),
  deleteCard,
);
router.put(
  '/cards/:cardId/likes',
  celebrate({ params: Joi.object().keys({ cardId: Joi.string().length(24).hex() }) }),
  putLikeCard,
);
router.delete(
  '/cards/:cardId/likes',
  celebrate({ params: Joi.object().keys({ cardId: Joi.string().length(24).hex() }) }),
  deleteLikeCard,
);

module.exports = router;
