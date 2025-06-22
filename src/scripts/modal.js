export function openModal(modalClass) {
  const modal = document.querySelector(modalClass);
  modal.classList.add('popup_is-opened');
  document.addEventListener('keydown', closeModalEsc);
  modal.addEventListener('click', closeModalOverlay);
}

export function closeModal(evt) {
  const modal = evt.target.closest('.popup');
  modal.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', closeModalEsc);
  modal.removeEventListener('click', closeModalOverlay)
}

function closeModalEsc(evt) {
  if (evt.key === 'Escape') {
    const openedModal = document.querySelector('.popup_is-opened');
    if (openedModal) {
      openedModal.classList.remove('popup_is-opened');
    }
  }
}

function closeModalOverlay(evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(evt);
  }
}