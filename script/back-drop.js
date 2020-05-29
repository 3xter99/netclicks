// смена карточки

// const showsList = document.querySelector('.tv-shows__list');
// showsList.addEventListener('mouseover', event => {
//  let target = event.target;
//  const tvCard = target.closest('.tv-card');
//  if (tvCard) {
//      const img = tvCard.querySelector('.tv-card__img');
//      const dataBack = img.getAttribute('data-backdrop');
//      img.dataset.oldsrc = img.getAttribute('src');
//      img.setAttribute('src', dataBack);
//  }
// });
//
// showsList.addEventListener('mouseout', event => {
//     let target = event.target;
//     const tvCard = target.closest('.tv-card');
//     if (tvCard) {
//         const img = tvCard.querySelector('.tv-card__img');
//         img.setAttribute('src', img.dataset.oldsrc);
//     }
// });
const showsList = document.querySelector('.tv-shows__list');

const changeImage = event => {
    const card = event.target.closest('.tv-shows__item');

    if (card) {
        const img = card.querySelector('.tv-card__img');
        if (img.dataset.backdrop) {
            [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
        };
    };

};

showsList.addEventListener('mouseover', changeImage);
showsList.addEventListener('mouseout', changeImage);
