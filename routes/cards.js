const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, putLikeCard, deleteLikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().uri(),
  }).unknown(true),
}), createCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', putLikeCard);
router.delete('/cards/:cardId/likes', deleteLikeCard);

module.exports = router;
