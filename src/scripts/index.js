import '../pages/index.css';
import { changeAvatar, getInitialCards, getUserInfo, likeCard, patchProfileEdit, postCreateCard, removeCardFromServer, unlikeCard } from './api.js';
import { cancelDelete, confirmDelete, createCard, deleteCard } from './card.js';
import { closeModal, closeModalByEvent, openModal } from './modal.js';
import { clearValidation, enableValidation } from './validation.js';

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
const profileName = document.querySelector('.profile__title');
const profileDesc = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');
const avatarEditFormElement = document.forms['update_avatar'];
const confirmPopup = document.querySelector('.popup_type_confirm');
const confirmButton = confirmPopup.querySelector('.popup__button');
const confirmCloseButton = confirmPopup.querySelector('.popup__close');

let currentUserId;
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userInfo, cardList]) => {
    currentUserId = userInfo._id

    profileName.textContent = userInfo.name;
    profileDesc.textContent = userInfo.about;
    profileAvatar.style.backgroundImage = `url('${userInfo.avatar}')`;

    cardList.forEach(card => {
      const newCard = createCard(card, handleDeleteCard, cardTemplate, handleImageClick, currentUserId, likeCard, unlikeCard);
      cardsContainer.append(newCard);
    });
  })
  .catch(err => {
    console.error(`Ошибка загрузки данных: ${err}`)
  });

function toggleButtonState(button, isLoading, originalText) {
  if (isLoading) {
    button.textContent = 'Сохранение...';
    button.disabled = true;
    button.classList.add('popup__button_loading');
  } else {
    button.textContent = originalText;
    button.disabled = false;
    button.classList.remove('popup__button_loading');
  }
}

function handleDeleteCard(evt, cardId) {
  deleteCard(evt, cardId, openModal);
}

confirmButton.addEventListener('click', () => confirmDelete(removeCardFromServer, closeModal));
confirmCloseButton.addEventListener('click', () => cancelDelete(closeModal));
confirmPopup.addEventListener('click', (evt) => {
  if (evt.target === confirmPopup) {
    cancelDelete();
  }
});

function handleImageClick(cardData) {
  const popupImage = document.querySelector('.popup__image');
  const popupCaption = document.querySelector('.popup__caption');

  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;

  openModal('.popup_type_image');
}

profileEditButton.addEventListener('click', () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDesc.textContent;
  openModal('.popup_type_edit');
  clearValidation(profileFormElement, validationConfig);
});

addCardButton.addEventListener('click', () => {
  openModal('.popup_type_new-card');
  clearValidation(cardForm, validationConfig);
});

profileAvatar.addEventListener('click', () => {
  openModal('.popup_type_avatar');
  clearValidation(avatarEditFormElement, validationConfig);
})

function handleAvatarUpdateFormSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.target.querySelector(validationConfig.submitButtonSelector);
  const originalText = submitButton.textContent;
  toggleButtonState(submitButton, true, originalText);

  const profileNewAvatarLink = document.querySelector('.profile__new_avatar-link').value;

  changeAvatar(profileNewAvatarLink)
    .then(() => {
      profileAvatar.style.backgroundImage = `url('${profileNewAvatarLink}')`;
      closeModal(evt);
      avatarEditFormElement.reset();
    })
    .catch((err) => {
      console.error(`Ошибка при обновлении аватара: ${err}`);
    })
    .finally(() => {
      toggleButtonState(submitButton, false, originalText);
    })
}

avatarEditFormElement.addEventListener('submit', handleAvatarUpdateFormSubmit);

closeButtons.forEach(button => {
  button.addEventListener('click', closeModalByEvent);
});

function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.target.querySelector(validationConfig.submitButtonSelector);
  const originalText = submitButton.textContent;

  toggleButtonState(submitButton, true, originalText);

  const profileName = document.querySelector('.profile__title');
  const profileJob = document.querySelector('.profile__description');

  patchProfileEdit(nameInput.value, jobInput.value)
    .then(() => {
      profileName.textContent = nameInput.value;
      profileJob.textContent = jobInput.value;
      closeModal(evt);
    })
    .catch((err) => {
      console.error(`Ошибка при обновлении профиля: ${err}`);
    })
    .finally(() => {
      toggleButtonState(submitButton, false, originalText);
    });
}

profileFormElement.addEventListener('submit', handleProfileFormSubmit);

function newCardFormSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.target.querySelector(validationConfig.submitButtonSelector);
  const originalText = submitButton.textContent;
  toggleButtonState(submitButton, true, originalText);

  const createData = {
    name: placeName.value,
    link: placeImg.value
  };

  postCreateCard(createData.name, createData.link)
    .then(newCardFromServer => {
      const newCard = createCard(
        newCardFromServer, 
        handleDeleteCard, 
        cardTemplate, 
        handleImageClick,
        currentUserId,
        likeCard,
        unlikeCard
      );
      cardsContainer.prepend(newCard);
      cardForm.reset();
      closeModal(evt);
      clearValidation(cardForm, validationConfig);
    })
    .catch(err => {
      console.error('Ошибка при создании карточки:', err);
    })
    .finally(() => {
      toggleButtonState(submitButton, false, originalText);
    })
}

cardForm.addEventListener('submit', newCardFormSubmit);

enableValidation(validationConfig);
