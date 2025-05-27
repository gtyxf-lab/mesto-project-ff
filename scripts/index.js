// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;
// @todo: DOM узлы
const cardPlace = document.querySelector('.places__list');
// @todo: Функция создания карточки
function addCard (cardData, deleteCard) {
  const card = cardTemplate.querySelector('.card').cloneNode(true);

  card.querySelector('.card__image').src = cardData.link;
  card.querySelector('.card__title').textContent = cardData.name;
  card.querySelector('.card__delete-button').addEventListener('click', deleteCard);

  return card;
};
// @todo: Функция удаления карточки
function deleteCard (evt) {
  evt.target.closest('.card').remove();
}

// @todo: Вывести карточки на страницу
initialCards.forEach(function (card) {
  const newCard = addCard(card, deleteCard);
  cardPlace.append(newCard);
});