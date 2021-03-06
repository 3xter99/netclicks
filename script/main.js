

// меню
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const SERVER = 'https://api.themoviedb.org/3'
const API_KEY = 'c06fedf2dd3ef459f90d84aa71530e16';




const leftMenu = document.querySelector('.left-menu');
 hamburger = document.querySelector('.hamburger'),
 tvShowsList = document.querySelector('.tv-shows__list'),
 modal = document.querySelector('.modal'),
 tvShows = document.querySelector('.tv-shows'),
 tvCardImg = document.querySelector('.tv-card__img'),
 modalTitle = document.querySelector('.modal__title'),
 genresList = document.querySelector('.genres-list'),
 rating = document.querySelector('.rating'),
 description = document.querySelector('.description'),
 modalLink = document.querySelector('.modal__link'),
 searchForm = document.querySelector('.search__form'),
 searchFormInput = document.querySelector('.search__form-input'),
 preloader = document.querySelector('.preloader'),
 dropdown = document.querySelectorAll('.dropdown'),
 tvShowsHead = document.querySelector('.tv-shows__head'),
 posterWrapper = document.querySelector('.poster__wrapper'),
 modalContent = document.querySelector('.modal__content');

const loading = document.createElement('div');
loading.className = 'loading';


// -------------------------------------------
class DBService {

    constructor() {
        this.SERVER = 'https://api.themoviedb.org/3';
        this.API_KEY = 'c06fedf2dd3ef459f90d84aa71530e16';
    }

    getData = async (url) => {
        const res = await fetch(url);
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Не удалось получить данные по 
            адресу ${url}`)
        }
    }

    getTestData = () => {
        return this.getData('test.json');
    }

    getTestCard = () => {
        return this.getData('card.json');
    }

    getSearchResult = query => this
        .getData(`${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`);

    getTvShow = id => this.getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);

    getTopRated = () => this.getData(`${this.SERVER}/tv/top_rated?api_key=${this.API_KEY}&language=ru-RU`);

    getPopular = () => this.getData(`${this.SERVER}/tv/popular?api_key=${this.API_KEY}&language=ru-RU`);

    getToDay = () => this.getData(`${this.SERVER}/tv/airing_today?api_key=${this.API_KEY}&language=ru-RU`);

    getWeek = () => this.getData(`${this.SERVER}/tv/on_the_air?api_key=${this.API_KEY}&language=ru-RU`);

}

const dbService = new DBService();

const renderCard= response => {
    console.log(response);
    tvShowsList.textContent = '';

    if (!response.total_results) {
        loading.remove();
        tvShowsHead.textContent = 'К сожалению по вашему запросу ничего не найдено...';
        tvShowsHead.style.cssText = 'color: red;';
        return;

    }
    tvShowsHead.textContent = 'Результат поиска';
    tvShowsHead.style.cssText = 'color: black;';

    response.results.forEach(item => {
        const {
            backdrop_path: backdrop,
            name: title,
            poster_path: poster,
            vote_average: vote,
            id
            } = item;

        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = backdrop ? IMG_URL + backdrop : '';
        const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';


        const card =document.createElement('li');
        card.idTv = id;
        card.className = 'tv-shows__item';
        card.innerHTML = `
            <a href="#" id="${id}" class="tv-card">
                        ${voteElem}
                        <img class="tv-card__img"
                             src="${posterIMG}"
                             data-backdrop="${backdropIMG}"
                             alt="${title}">
                        <h4 class="tv-card__head">${title}</h4>
            </a>
        `;
        loading.remove(); //удаление прилоудера перед добавлением карточек
        tvShowsList.append(card);

    });

};

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchFormInput.value.trim();
    if (value) {
        tvShows.append(loading);
        dbService.getSearchResult(value).then(renderCard);
    }
    searchFormInput.value = '';

    })


// -----------------------------------

const closeDropdown = () => {
    dropdown.forEach(item => {
        console.log(item);
    })
}

// открытие закрытие меню

hamburger.addEventListener('click', () => {
   leftMenu.classList.toggle('openMenu')
    hamburger.classList.toggle('open');
    closeDropdown();
});

document.addEventListener('click', event => {
    const target = event.target;
    if (!target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
        closeDropdown();
    }

});

leftMenu.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }

    if (target.closest('#top-rated')) {
        dbService.getTopRated().then(renderCard);

    }

    if (target.closest('#popular')) {
        dbService.getPopular().then(renderCard);

    }

    if (target.closest('#week')) {
        dbService.getWeek().then(renderCard);

    }

    if (target.closest('#today')) {
        dbService.getToDay().then(renderCard);

    }

});


//Смена картинки на карточке
const changeImage = event => {
    const card = event.target.closest('.tv-shows__item');

    if (card) {
        const img = card.querySelector('.tv-card__img');
        if (img.dataset.backdrop) {
            [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
        }
    }

};

tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);




// открытие модальног оокна

tvShowsList.addEventListener('click', event => {
    event.preventDefault();

    const target = event.target;
    const card = target.closest('.tv-card');

    if (card) {
        // tvShows.append(loading);
        preloader.style.display = 'block';
        dbService.getTvShow(card.id)
            .then(({
                poster_path: posterPath,
                name: title,
                genres,
                vote_average: voteAverage,
                overview,
                homepage }) => {
                 // loading.remove();

                    if (posterPath) {
                        tvCardImg.src = IMG_URL + posterPath; // меняем картинку
                        tvCardImg.alt = title;
                        posterWrapper.style.display = '';
                    } else {
                        posterWrapper.style.display = 'none';
                        modalContent.style.paddingLeft = '25px';
                    }


                    modalTitle.textContent = title; // меняем название
                    genresList.textContent = '';  // очищаем жанры
                    genres.forEach(item => {
                        genresList.innerHTML += `<li>${item.name}</li>`;    // Добавляем жанры
                    });
                    rating.textContent = voteAverage;
                    description.textContent = overview;
                    modalLink.href = homepage;

            })

            .then(() => {
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
            })
            .then(() => {
                preloader.style.display = '';
            })

    }
});

modal.addEventListener('click', event => {
   // console.log(event.target.classList.contains('modal'));
    if (event.target.closest('.cross') ||
        event.target.classList.contains('modal')) {
        // наверное сюда прилоадер
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
});

