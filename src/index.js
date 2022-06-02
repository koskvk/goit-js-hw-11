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

let totalPages = null;

form.addEventListener('submit', onFormSubmit);
loadMoreButton.addEventListener('click', onShowNextPage);

let galleryLightBox = new SimpleLightbox('.gallery a', options.simpleLightBox);

function onFormSubmit(event) {
  event.preventDefault();

  onHiddenLoadMoreButton();
  
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
}

function dataProcessing(response) {
  const totalHits = response.data.totalHits;
  const lenghtHits = response.data.hits.length;

  totalPages = Math.ceil(totalHits / searchImages.per_page);

  searchButton.disabled = false;

  if (lenghtHits === searchImages.per_page) {
    ofHiddenLoadMoreButton();
  }

  if (totalHits === 0) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }

  if (totalHits !== 0 && lenghtHits === 0) {
    Notify.warning(`We're sorry, but you've reached the end of search results.`);

    onHiddenLoadMoreButton();

    return;
  }

  gallery.insertAdjacentHTML('beforeend', markup(response.data.hits));

  galleryLightBox.refresh();
}

async function onShowNextPage() {
  await loadPictures();

  if (searchImages.pageNumber === totalPages) {    
    onHiddenLoadMoreButton();
  }
}

function onHiddenLoadMoreButton() {
  loadMoreButton.disabled = true;
  loadMoreButton.classList.add('is-hidden');
}

function ofHiddenLoadMoreButton() {
  loadMoreButton.disabled = false;
  loadMoreButton.classList.remove('is-hidden');
}
