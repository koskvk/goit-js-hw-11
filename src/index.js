import './css/styles.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import ServiceAPI from "./serviceApi";
const searchImages = new ServiceAPI();

import markup from "./markupCardImg";


const form = document.querySelector('.search-form');
const searchButton = document.querySelector('[type=submit]');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

const options = {
  simpleLightBox: {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
  },
};

form.addEventListener('submit', onFormSubmit);
loadMoreButton.addEventListener('click', onShowNextPage);

let galleryLightBox = new SimpleLightbox('.gallery a', options.simpleLightBox);

function onFormSubmit(event) {
  event.preventDefault();

  const isFilled = event.currentTarget.elements.searchQuery.value;
  if (isFilled) {
    searchButton.disabled = true;
    searchImages.searchQuery = isFilled;
    searchImages.resetPage();
    gallery.innerHTML = '';
    loadPictures();
  }
}

function loadPictures() {
  searchImages
    .getImage()
    .then(dataProcessing)
    .catch(error => {
      console.log(error);
      Notify.failure('Something went wrong, please try again...');
    });
  
  onHiddenLoadMoreButton();
}

function dataProcessing(response) {
  searchButton.disabled = false;
  if (response.data.totalHits === 0) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }
  if (response.data.totalHits !== 0 && response.data.hits.length === 0) {
    Notify.warning(`We're sorry, but you've reached the end of search results.`);
    return;
  }

  gallery.insertAdjacentHTML('beforeend', markup(response.data.hits));

  galleryLightBox.refresh();
}

async function onShowNextPage() {
  searchImages.pageNumber += 1;
  await loadPictures();

  loadMoreButton.removeAttribute('disabled');
  loadMoreButton.classList.remove('is-hidden');
}

function onHiddenLoadMoreButton() {
    refs.loadMoreButton.setAttribute("disabled", "");
    refs.loadMoreButton.classList.add('is-hidden');
}
