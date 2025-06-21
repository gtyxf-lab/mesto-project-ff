import '../pages/index.css';
import { initialCards } from './cards.js';
import { closeModal, openModal } from './modal.js';

const cardTemplate = document.querySelector('#card-template').content;
const cardsContainer = document.querySelector('.places__list');
const profileEditButton = document.querySelector('.profile__edit-button');
const closeButtons = document.querySelectorAll('.popup__close');
const addCardButton = document.querySelector('.profile__add-button');
const formElement = document.forms['edit-profile'];
const nameInput = formElement.elements.name;
const jobInput = formElement.elements.description;

function createCard (cardData, deleteCard) {
  const card = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = card.querySelector('.card__image');
  const cardTitle = card.querySelector('.card__title');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  card.querySelector('.card__title').textContent = cardData.name;
  card.querySelector('.card__delete-button').addEventListener('click', deleteCard);

  cardImage.addEventListener('click', () => {
    const popupImage = document.querySelector('.popup__image');
    const popupCaption = document.querySelector('.popup__caption');

    popupImage.src = cardData.link;
    popupImage.alt = cardData.name;
    popupCaption.textContent = cardData.name;

    openModal('.popup_type_image');
  })

  return card;
};

function deleteCard (evt) {
  evt.target.closest('.card').remove();
}

initialCards.forEach(function (card) {
  const newCard = createCard(card, deleteCard);
  cardsContainer.append(newCard);
});

profileEditButton.addEventListener('click', () => {
  nameInput.value = document.querySelector('.profile__title').textContent;
  jobInput.value = document.querySelector('.profile__description').textContent;

  openModal('.popup_type_edit')
});
addCardButton.addEventListener('click', () => openModal('.popup_type_new-card'))

closeButtons.forEach(button => {
  button.addEventListener('click', closeModal)
})

function handleFormSubmit(evt) {
  evt.preventDefault(); 
  const profileName = document.querySelector('.profile__title');
  const profileJob = document.querySelector('.profile__description');

  profileName.textContent = nameInput.value;
  profileJob.textContent = jobInput.value;

  closeModal(evt);
}

formElement.addEventListener('submit', handleFormSubmit);

const cardForm = document.forms['new-place'];
const placeName = cardForm.elements['place-name'];
const placeImg = cardForm.elements.link;

function newCardFormSubmit(evt) {
  evt.preventDefault();

  const createData = {
    name: placeName.value,
    link: placeImg.value
  };

  const newCard = createCard(createData, deleteCard);
  cardsContainer.prepend(newCard);
  cardForm.reset();
  closeModal(evt)
}

cardForm.addEventListener('submit', newCardFormSubmit)