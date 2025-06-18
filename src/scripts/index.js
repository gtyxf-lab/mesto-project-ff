import '../pages/index.css';
import { initialCards } from './cards.js';
// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;
// @todo: DOM узлы
const cardsContainer = document.querySelector('.places__list');
// @todo: Функция создания карточки
function createCard (cardData, deleteCard) {
  const card = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = card.querySelector('.card__image');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
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
  const newCard = createCard(card, deleteCard);
  cardsContainer.append(newCard);
});

// const profileEdit = document.getElementById('testbtn');
// const popupContainer = document.querySelector('popup');

// profileEdit.addEventListener('click', openModal)

// function openModal() {
//   document.getElementById('popup').style.display = 'flex'
// }