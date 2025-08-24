import { removeCardFromServer } from "./api";
import { closeModal, openModal } from "./modal";

let cardToDeleteId = null;
let cardToDeleteElement = null;

export function confirmDelete() {
  if (cardToDeleteId && cardToDeleteElement) {
    removeCardFromServer(cardToDeleteId)
      .then(() => {
        cardToDeleteElement.remove();
        closeModal();

        cardToDeleteId = null;
        cardToDeleteElement = null;
      })
      .catch(err => {
        console.error('Ошибка при удалении карточки:', err);
        closeModal();
      });
  }
}

export function cancelDelete() {
  cardToDeleteId = null;
  cardToDeleteElement = null;
  closeModal();
}

export function deleteCard(evt, cardId) {
  const cardElement = evt.target.closest('.card');
  
  cardToDeleteId = cardId;
  cardToDeleteElement = cardElement;
  openModal('.popup_type_confirm');
}

export function createCard(cardData, deleteCard, cardTemplate, handleImageClick, userId, likeCallback, unlikeCallback) {
  const card = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = card.querySelector('.card__image');
  const cardTitle = card.querySelector('.card__title');
  const cardLikeButton = card.querySelector('.card__like-button');
  const cardLikeCount = card.querySelector('.card__like-count');
  const deleteButton = card.querySelector('.card__delete-button');
  const isLiked = cardData.likes.some(like => like._id === userId);

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  cardLikeCount.textContent = cardData.likes.length;

  cardImage.addEventListener('error', () => {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'card__image-error';
    errorContainer.innerHTML = `
      <div class="card__image-error-background"></div>
      <p class="card__image-error-text">Не удалось загрузить изображение :(</p>
    `;

    cardImage.style.display = 'none';
    card.insertBefore(errorContainer, cardImage.nextSibling)
  })

  if (isLiked) {
    cardLikeButton.classList.add('card__like-button_is-active');
  }

  if (cardData.owner._id !== userId) {
    deleteButton.style.display = 'none';
  } else {
    deleteButton.addEventListener('click', (evt) => {
      deleteCard(evt, cardData._id);
    });

  }

  cardLikeButton.addEventListener('click', (evt) => {
    const isCurrentlyLiked = evt.target.classList.contains('card__like-button_is-active');
    
    if (isCurrentlyLiked) {
      unlikeCallback(cardData._id)
        .then(updatedCard => {
          evt.target.classList.remove('card__like-button_is-active');
          cardLikeCount.textContent = updatedCard.likes.length;
        })
        .catch(err => {
          console.error('Ошибка при снятии лайка:', err);
        });
    } else {
      likeCallback(cardData._id)
        .then(updatedCard => {
          evt.target.classList.add('card__like-button_is-active');
          cardLikeCount.textContent = updatedCard.likes.length;
        })
        .catch(err => {
          console.error('Ошибка при установке лайка:', err);
        });
    }
  });

  cardImage.addEventListener('click', () => handleImageClick(cardData));

  return card;
}