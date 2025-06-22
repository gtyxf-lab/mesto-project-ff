import '../pages/index.css';
import { createCard, deleteCard } from './card.js';
import { initialCards } from './cards.js';
import { closeModal, openModal } from './modal.js';

const cardTemplate = document.querySelector('#card-template').content;
const cardsContainer = document.querySelector('.places__list');
const profileEditButton = document.querySelector('.profile__edit-button');
const closeButtons = document.querySelectorAll('.popup__close');
const addCardButton = document.querySelector('.profile__add-button');
const profileFormElement = document.forms['edit-profile'];
const nameInput = profileFormElement.elements.name;
const jobInput = profileFormElement.elements.description;
const cardForm = document.forms['new-place'];
const placeName = cardForm.elements['place-name'];
const placeImg = cardForm.elements.link;

function handleImageClick(cardData) {
  const popupImage = document.querySelector('.popup__image');
  const popupCaption = document.querySelector('.popup__caption');

  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;

  openModal('.popup_type_image');
}

initialCards.forEach((card) => {
  const newCard = createCard(card, deleteCard, cardTemplate, handleImageClick);
  cardsContainer.append(newCard);
});

profileEditButton.addEventListener('click', () => {
  nameInput.value = document.querySelector('.profile__title').textContent;
  jobInput.value = document.querySelector('.profile__description').textContent;
  openModal('.popup_type_edit');
});

addCardButton.addEventListener('click', () => openModal('.popup_type_new-card'));

closeButtons.forEach(button => {
  button.addEventListener('click', closeModal);
});

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const profileName = document.querySelector('.profile__title');
  const profileJob = document.querySelector('.profile__description');

  profileName.textContent = nameInput.value;
  profileJob.textContent = jobInput.value;

  closeModal(evt);
}

profileFormElement.addEventListener('submit', handleProfileFormSubmit);

function newCardFormSubmit(evt) {
  evt.preventDefault();

  const createData = {
    name: placeName.value,
    link: placeImg.value
  };

  const newCard = createCard(createData, deleteCard, cardTemplate, handleImageClick);
  cardsContainer.prepend(newCard);
  cardForm.reset();
  closeModal(evt);
}

cardForm.addEventListener('submit', newCardFormSubmit);