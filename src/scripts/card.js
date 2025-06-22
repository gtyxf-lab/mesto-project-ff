export function createCard(cardData, deleteCard, cardTemplate, handleImageClick) {
  const card = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = card.querySelector('.card__image');
  const cardTitle = card.querySelector('.card__title');
  const cardLikeButton = card.querySelector('.card__like-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  card.querySelector('.card__delete-button').addEventListener('click', deleteCard);

  cardLikeButton.addEventListener('click', (evt) => {
    evt.target.classList.toggle('card__like-button_is-active');
  });

  cardImage.addEventListener('click', () => handleImageClick(cardData));

  return card;
}

export function deleteCard(evt) {
  evt.target.closest('.card').remove();
}